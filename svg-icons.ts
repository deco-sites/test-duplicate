import { Config, optimize } from "npm:svgo";
import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.41-alpha-artifacts/deno-dom-wasm.ts";
import { Plugin } from "$fresh/server.ts";
import { parse } from "std/flags/mod.ts";
import * as colors from "std/fmt/colors.ts";

const exists = async (filename: string): Promise<boolean> => {
  try {
    await Deno.stat(filename);
    // successful, file or directory must exist
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return false;
    }
    throw error;
  }
};

const config = {
  plugins: ["removeDimensions"],
} as Config;

async function spritesToSVG(spritesPath: string, outFolder: string) {
  if (!(await exists(spritesPath))) {
    throw new Error("Sprites file not found.");
  }
  if (!(await exists(outFolder))) {
    await Deno.mkdir(outFolder);
  }

  const sprites = await Deno.readTextFile(spritesPath);

  const parser = new DOMParser();
  const doc = parser.parseFromString(sprites, "text/html");

  const svgMap = new Map<string, string>();

  for (const s of doc?.querySelectorAll("symbol") ?? []) {
    const symbol = s as Element;
    const id = (symbol as Element).getAttribute("id");

    if (!id) throw new Error(`Missing id for symbol: ${symbol.outerHTML}`);
    const content = `<svg ${
      symbol.outerHTML
        .replace(/<symbol id=".+?" /g, "")
        .replace(/<\/symbol>$/g, "</svg>")
    }`;

    svgMap.set(id, content);
  }

  for (const [id, content] of svgMap) {
    const optimized = optimize(content, config);

    await Deno.writeTextFile(`${outFolder}/${id}.svg`, optimized.data);
  }
}

async function SVGSToSprites(svgsDir: string, spritesPath: string) {
  if (!(await exists(svgsDir))) {
    throw new Error("SVG file not found.");
  }

  const svgMap = new Map<string, string>();

  for await (const file of Deno.readDir(svgsDir)) {
    if (!file.isFile || !file.name.endsWith(".svg")) continue;

    const svg = await Deno.readTextFile(`${svgsDir}/${file.name}`);
    const optimized = optimize(svg, config);
    const id = file.name.replace(".svg", "");

    svgMap.set(
      id,
      optimized.data
        .replace("<svg", `<symbol id="${id}"`)
        .replace("</svg>", "</symbol>"),
    );
  }

  const content =
    `<svg style="display:none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">\n${
      [...svgMap.values()]
        .sort()
        .map((i) => `    ${i}`)
        .join("\n")
    }\n</svg>`;

  await Deno.writeTextFile(spritesPath, content);
}

async function generateIconsTypes(spritesPath: string, outFile: string) {
  if (!(await exists(spritesPath))) {
    throw new Error("Sprites file not found.");
  }

  const ids = [] as string[];

  const sprites = await Deno.readTextFile(spritesPath);

  const parser = new DOMParser();
  const doc = parser.parseFromString(sprites, "text/html");

  for (const s of doc?.querySelectorAll("symbol") ?? []) {
    const symbol = s as Element;
    const id = (symbol as Element).getAttribute("id");

    if (!id) throw new Error(`Missing id for symbol: ${symbol.outerHTML}`);

    ids.push(id);
  }

  const formatted = `\n${
    ids
      .sort()
      .map((id) => `    | '${id}'`)
      .join("\n")
  }`;

  await Deno.writeTextFile(
    outFile,
    `
import { asset } from '$fresh/runtime.ts'
import type { JSX } from 'preact'

export type AvailableIcons = ${formatted}

interface Props extends JSX.SVGAttributes<SVGSVGElement> {
  id: AvailableIcons;
  size?: number;
  title?: string;
}

function Icon(
  { id, strokeWidth = 16, size, width, height, title, ...otherProps }: Props,
) {
  return (
    <svg
      {...otherProps}
      width={width ?? size}
      height={height ?? size}
      strokeWidth={strokeWidth}
    >
      <use href={asset(\`/sprites.svg#$\{id\}\`)} />
      {title && <title>{title}</title>}
    </svg>
  );
}

export default Icon
`.trim(),
  );
}

const flags = parse(Deno.args, {
  boolean: ["transform", "sprites", "gen"],
});

if (flags.transform) {
  await spritesToSVG("static/sprites.svg", "svg-icons");
  console.log(colors.blue("Transformed sprites to svg!"));
}

if (flags.sprites) {
  await SVGSToSprites("svg-icons", "static/sprites.svg");
  await generateIconsTypes("static/sprites.svg", "components/ui/Icon.tsx");
  console.log(colors.blue("Icons generated!"));
}

if (flags.gen) {
  await generateIconsTypes("static/sprites.svg", "components/ui/Icon.tsx");
  console.log(colors.blue("Icons types generated!"));
}

export default function (): Plugin {
  SVGSToSprites("svg-icons", "static/sprites.svg").then(async () => {
    await generateIconsTypes("static/sprites.svg", "components/ui/Icon.tsx");
    console.log(colors.blue("Icons generated!"));
  });

  return {
    name: "svg-icons",
  };
}

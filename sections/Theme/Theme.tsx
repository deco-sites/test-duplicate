/**
 * Theme generator inspired by Daisy UI:
 * Copyright (c) 2020 Pouya Saadeghi
 * License: MIT (https://github.com/saadeghi/daisyui/blob/37bca23444bc9e4d304362c14b7088f9a08f1c74/LICENSE)
 * https://github.com/saadeghi/daisyui/blob/37bca23444bc9e4d304362c14b7088f9a08f1c74/src/docs/src/routes/theme-generator.svelte
 */
import SiteTheme, { Font } from "apps/website/components/Theme.tsx";
import Color from "npm:colorjs.io";
import { defaultColors } from "../../components/theme/defaultColors.ts";
import type {
  ComplementaryColors,
  ThemeColors,
} from "$store/components/theme/theme.d.ts";
import type { ComponentChildren } from "preact";
import { clx } from "deco-sites/fast-fashion/sdk/clx.ts";

export interface Button {
  /**
   * @default 1px
   * @title Largura da borda
   */
  "--border-btn": "1px" | "2px" | "3px" | "4px" | "5px" | "6px" | "7px" | "8px";
  /**
   * @default 0.2rem
   * @title Raio do botão
   */
  "--rounded-btn": "0" | "0.2rem" | "0.4rem" | "0.8rem" | "2rem";
  /**
   * @default 0.95
   * @title Escala de clique
   * @description Escala de transformação do botão ao clicar
   */
  "--btn-focus-scale": "0.9" | "0.95" | "1" | "1.05" | "1.1";
  /**
   * @default 0.25s
   * @title Animação do botão
   * @description Duração da animação do botão ao clicar
   */
  "--animation-btn": "0.1s" | "0.15s" | "0.2s" | "0.25s" | "0.3s" | "0.35s";
}

export type ProductImageAspectRatio = "1/1" | "2/3" | "4/3" | "3/4";
export type ProductImageFit = "cover" | "contain";

export type ProductImages = {
  aspectRatio?: ProductImageAspectRatio;
  fit?: ProductImageFit;
};

export interface Props {
  /**
   * @description Cores principais do tema
   */
  mainColors?: ThemeColors;

  /**
   * @description Cores complementares do tema, cores não preenchidas serão
   */
  complementaryColors?: ComplementaryColors;
  /**
   * @description Imagens do produto
   */
  productImages?: ProductImages;
  /**
   * @description Estilo dos botões
   */
  buttonStyle?: Button;
  /**
   * @description Fonte do tema, a configuração das fontes primarias, secundaria e terciarias esta sendo feita pela ordem de adição
   */
  font?: Font;
}

const CMY_HUES = [180, 300, 60];
// const RGB_HUES = [360, 240, 120, 0];

type Theme = ThemeColors & ComplementaryColors & Button & ProductImages;

function hueShift(hues: Array<number>, hue: number, intensity: number) {
  const closestHue = hues.sort(
      (a, b) => Math.abs(a - hue) - Math.abs(b - hue),
    )[0],
    hueShift = closestHue - hue;
  return Math.round(intensity * hueShift * 0.5);
}

function lighten(hex: string, intensity: number) {
  if (!hex) {
    return "";
  }

  const color = new Color(hex);

  const [h, s, v] = color.hsv;
  const hue = h + hueShift(CMY_HUES, h, intensity);
  const saturation = s - Math.round(s * intensity);
  const value = v + Math.round((100 - v) * intensity);

  return new Color("hsv", [hue, saturation, value]);
}

// function darken(hex: string, intensity: number) {
//   if (!hex) {
//     return "";
//   }

//   const color = new Color(hex);

//   const inverseIntensity = 1 - intensity;
//   const [h, s, v] = color.hsv;
//   const hue = h + hueShift(RGB_HUES, h, inverseIntensity);
//   const saturation = s + Math.round((100 - s) * inverseIntensity);
//   const value = v - Math.round(v * inverseIntensity);

//   return new Color("hsv", [hue, saturation, value]);
// }

export const getBetterContrastingColor = (
  color: string | Color,
  ...colors: string[]
) => {
  const c = new Color(color);
  const [betterColor] = colors.sort((a, b) => {
    const colorA = new Color(a);
    const colorB = new Color(b);

    return (
      Math.abs(colorB.contrast(c, "APCA")) -
      Math.abs(colorA.contrast(c, "APCA"))
    );
  });

  return betterColor;
};

const INTENSITY_MAP: {
  [key: number]: number;
} = {
  50: 0.95,
  100: 0.9,
  200: 0.75,
  300: 0.6,
  400: 0.3,
  500: 0.15,
  600: 0.03,
};

const toVariables = (t: Theme & Required<ThemeColors>): [string, string][] => {
  const toValue = (color: string | ReturnType<typeof lighten>) => {
    const [l, c, h] = new Color(color).oklch;

    return `${(l * 100).toFixed(0)}% ${c.toFixed(2)} ${(h || 0).toFixed(0)}deg`;
  };

  const primary = {
    500: t["primary"],
    400: t["primaryShades"]?.["400"] ??
      lighten(t["primary"], INTENSITY_MAP[400]),
    300: t["primaryShades"]?.["300"] ??
      lighten(t["primary"], INTENSITY_MAP[300]),
    200: t["primaryShades"]?.["200"] ??
      lighten(t["primary"], INTENSITY_MAP[200]),
    100: t["primaryShades"]?.["100"] ??
      lighten(t["primary"], INTENSITY_MAP[100]),
  };

  const secondary = {
    500: t["secondary"],
    400: t["secondaryShades"]?.["400"] ??
      lighten(t["secondary"], INTENSITY_MAP[400]),
    300: t["secondaryShades"]?.["300"] ??
      lighten(t["secondary"], INTENSITY_MAP[300]),
    200: t["secondaryShades"]?.["200"] ??
      lighten(t["secondary"], INTENSITY_MAP[200]),
    100: t["secondaryShades"]?.["100"] ??
      lighten(t["secondary"], INTENSITY_MAP[100]),
  };

  const neutral = {
    700: t["neutral"],
    600: t["neutralShades"]?.["600"] ??
      lighten(t["neutral"], INTENSITY_MAP[600]),
    500: t["neutralShades"]?.["500"] ??
      lighten(t["neutral"], INTENSITY_MAP[500]),
    400: t["neutralShades"]?.["400"] ??
      lighten(t["neutral"], INTENSITY_MAP[400]),
    300: t["neutralShades"]?.["300"] ??
      lighten(t["neutral"], INTENSITY_MAP[300]),
    200: t["neutralShades"]?.["200"] ??
      lighten(t["neutral"], INTENSITY_MAP[200]),
    100: t["base-100"],
  };

  const danger = {
    500: t["danger"],
    400: t["dangerShades"]?.["400"] ?? lighten(t["danger"], INTENSITY_MAP[400]),
    300: t["dangerShades"]?.["300"] ?? lighten(t["danger"], INTENSITY_MAP[300]),
    200: t["dangerShades"]?.["200"] ?? lighten(t["danger"], INTENSITY_MAP[200]),
    100: t["dangerShades"]?.["100"] ?? lighten(t["danger"], INTENSITY_MAP[100]),
  };

  const warning = {
    500: t["warning"],
    400: t["warningShades"]?.["400"] ??
      lighten(t["warning"], INTENSITY_MAP[400]),
    300: t["warningShades"]?.["300"] ??
      lighten(t["warning"], INTENSITY_MAP[300]),
    200: t["warningShades"]?.["200"] ??
      lighten(t["warning"], INTENSITY_MAP[200]),
    100: t["warningShades"]?.["100"] ??
      lighten(t["warning"], INTENSITY_MAP[100]),
  };

  const success = {
    500: t["success"],
    400: t["successShades"]?.["400"] ??
      lighten(t["success"], INTENSITY_MAP[400]),
    300: t["successShades"]?.["300"] ??
      lighten(t["success"], INTENSITY_MAP[300]),
    200: t["successShades"]?.["200"] ??
      lighten(t["success"], INTENSITY_MAP[200]),
    100: t["successShades"]?.["100"] ??
      lighten(t["success"], INTENSITY_MAP[100]),
  };

  const info = {
    500: t["info"],
    400: t["infoShades"]?.["400"] ?? lighten(t["info"], INTENSITY_MAP[400]),
    300: t["infoShades"]?.["300"] ?? lighten(t["info"], INTENSITY_MAP[300]),
    200: t["infoShades"]?.["200"] ?? lighten(t["info"], INTENSITY_MAP[200]),
    100: t["infoShades"]?.["100"] ?? lighten(t["info"], INTENSITY_MAP[100]),
  };

  const colorVariables = Object.entries({
    "--primary-500": primary[500],
    "--primary-400": primary[400],
    "--primary-400-content": getBetterContrastingColor(
      primary[400],
      t["neutral"],
      t["base-100"],
    ),
    "--primary-300": primary[300],
    "--primary-300-content": getBetterContrastingColor(
      primary[300],
      t["neutral"],
      t["base-100"],
    ),
    "--primary-200": primary[200],
    "--primary-200-content": getBetterContrastingColor(
      primary[200],
      t["neutral"],
      t["base-100"],
    ),
    "--primary-100": primary[100],
    "--primary-100-content": getBetterContrastingColor(
      primary[100],
      t["neutral"],
      t["base-100"],
    ),

    "--secondary": secondary[500],
    "--secondary-500": secondary[500],
    "--secondary-400": secondary[400],
    "--secondary-400-content": getBetterContrastingColor(
      secondary[400],
      t["neutral"],
      t["base-100"],
    ),
    "--secondary-300": secondary[300],
    "--secondary-300-content": getBetterContrastingColor(
      secondary[300],
      t["neutral"],
      t["base-100"],
    ),
    "--secondary-200": secondary[200],
    "--secondary-200-content": getBetterContrastingColor(
      secondary[200],
      t["neutral"],
      t["base-100"],
    ),
    "--secondary-100": secondary[100],
    "--secondary-100-content": getBetterContrastingColor(
      secondary[100],
      t["neutral"],
      t["base-100"],
    ),

    "--neutral-700": t["neutral"],
    "--neutral-600": neutral[600],
    "--neutral-600-content": getBetterContrastingColor(
      neutral[600],
      t["neutral"],
      t["base-100"],
    ),
    "--neutral-500": neutral[500],
    "--neutral-500-content": getBetterContrastingColor(
      neutral[500],
      t["neutral"],
      t["base-100"],
    ),
    "--neutral-400": neutral[400],
    "--neutral-400-content": getBetterContrastingColor(
      neutral[400],
      t["neutral"],
      t["base-100"],
    ),
    "--neutral-300": neutral[300],
    "--neutral-300-content": getBetterContrastingColor(
      neutral[300],
      t["neutral"],
      t["base-100"],
    ),
    "--neutral-200": neutral[200],
    "--neutral-200-content": getBetterContrastingColor(
      neutral[200],
      t["neutral"],
      t["base-100"],
    ),
    "--neutral-100": neutral[100],
    "--neutral-100-content": getBetterContrastingColor(
      neutral[100],
      t["neutral"],
      t["base-100"],
    ),

    "--danger": danger[500],
    "--danger-500": danger[500],
    "--danger-400": danger[400],
    "--danger-400-content": getBetterContrastingColor(
      danger[400],
      t["neutral"],
      t["base-100"],
    ),
    "--danger-300": danger[300],
    "--danger-300-content": getBetterContrastingColor(
      danger[300],
      t["neutral"],
      t["base-100"],
    ),
    "--danger-200": danger[200],
    "--danger-200-content": getBetterContrastingColor(
      danger[200],
      t["neutral"],
      t["base-100"],
    ),
    "--danger-100": danger[100],
    "--danger-100-content": getBetterContrastingColor(
      danger[100],
      t["neutral"],
      t["base-100"],
    ),

    "--warning": warning[500],
    "--warning-500": warning[500],
    "--warning-400": warning[400],
    "--warning-400-content": getBetterContrastingColor(
      warning[400],
      t["neutral"],
      t["base-100"],
    ),
    "--warning-300": warning[300],
    "--warning-300-content": getBetterContrastingColor(
      warning[300],
      t["neutral"],
      t["base-100"],
    ),
    "--warning-200": warning[200],
    "--warning-200-content": getBetterContrastingColor(
      warning[200],
      t["neutral"],
      t["base-100"],
    ),
    "--warning-100": warning[100],
    "--warning-100-content": getBetterContrastingColor(
      warning[100],
      t["neutral"],
      t["base-100"],
    ),

    "--success": success[500],
    "--success-500": success[500],
    "--success-400": success[400],
    "--success-400-content": getBetterContrastingColor(
      success[400],
      t["neutral"],
      t["base-100"],
    ),
    "--success-300": success[300],
    "--success-300-content": getBetterContrastingColor(
      success[300],
      t["neutral"],
      t["base-100"],
    ),
    "--success-200": success[200],
    "--success-200-content": getBetterContrastingColor(
      success[200],
      t["neutral"],
      t["base-100"],
    ),
    "--success-100": success[100],
    "--success-100-content": getBetterContrastingColor(
      success[100],
      t["neutral"],
      t["base-100"],
    ),

    "--info": info[500],
    "--info-500": info[500],
    "--info-400": info[400],
    "--info-400-content": getBetterContrastingColor(
      info[400],
      t["neutral"],
      t["base-100"],
    ),
    "--info-300": info[300],
    "--info-300-content": getBetterContrastingColor(
      info[300],
      t["neutral"],
      t["base-100"],
    ),
    "--info-200": info[200],
    "--info-200-content": getBetterContrastingColor(
      info[200],
      t["neutral"],
      t["base-100"],
    ),
    "--info-100": info[100],
    "--info-100-content": getBetterContrastingColor(
      info[100],
      t["neutral"],
      t["base-100"],
    ),

    "--p": t["primary"],
    "--pc": getBetterContrastingColor(
      t["primary"],
      t["neutral"],
      t["base-100"],
    ),

    "--s": t["secondary"],
    "--sc": getBetterContrastingColor(
      t["secondary"],
      t["neutral"],
      t["base-100"],
    ),

    "--a": t["secondary"],
    "--ac": getBetterContrastingColor(
      t["secondary"],
      t["neutral"],
      t["base-100"],
    ),

    "--n": t["neutral"]["600"] ?? lighten(t["neutral"], INTENSITY_MAP[600]),
    "--nc": t["base-100"],

    "--b1": t["base-100"],
    "--b2": t["neutralShades"]?.["200"] ??
      lighten(t["neutral"], INTENSITY_MAP[200]),
    "--b3": t["neutralShades"]?.["300"] ??
      lighten(t["neutral"], INTENSITY_MAP[300]),
    "--bc": t["neutral"]["600"] ?? lighten(t["neutral"], INTENSITY_MAP[600]),

    "--su": t["success"],
    "--suc": getBetterContrastingColor(
      t["success"],
      t["neutral"],
      t["base-100"],
    ),

    "--wa": t["warning"],
    "--wac": getBetterContrastingColor(
      t["secondary"],
      t["neutral"],
      t["base-100"],
    ),

    "--er": t["danger"],
    "--erc": getBetterContrastingColor(
      t["danger"],
      t["neutral"],
      t["base-100"],
    ),

    "--in": t["info"],
    "--inc": getBetterContrastingColor(t["info"], t["neutral"], t["base-100"]),
  }).map(([key, color]) => {
    return [key, toValue(color)] as [string, string];
  });

  const miscellaneousVariables = Object.entries({
    "--rounded-btn": t["--rounded-btn"],
    "--animation-btn": t["--animation-btn"],
    "--btn-focus-scale": t["--btn-focus-scale"],
    "--border-btn": t["--border-btn"],
    "--product-aspect-ratio": t?.aspectRatio || "1/1",
    "--product-fit": t?.fit || "cover",
  });

  return [...colorVariables, ...miscellaneousVariables];
};

const defaultTheme = {
  ...defaultColors,
  "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
  "--rounded-btn": "0.2rem" as const, // border radius rounded-btn utility class, used in buttons and similar element
  "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
  "--animation-btn": "0.25s" as const, // duration of animation when you click on button
  "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
  "--btn-focus-scale": "0.95" as const, // scale transform of button when you focus on it
  "--border-btn": "1px" as const, // border width of buttons
  "--tab-border": "1px", // border width of tabs
  "--tab-radius": "0.5rem", // border radius of tabs
};

/**
 * @title Tema
 */
function Section({
  mainColors,
  complementaryColors,
  buttonStyle,
  font,
  productImages,
}: Props) {
  const theme = {
    ...defaultTheme,
    ...mainColors,
    ...complementaryColors,
    ...buttonStyle,
    ...productImages,
  };

  const [primaryFont, secondaryFont, tertiaryFont] = font?.family.split(",") ||
    [];

  const variables = [
    ...toVariables(theme),
    [
      "--font-family",
      primaryFont ||
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
    ],
    [
      "--font-secondary",
      secondaryFont || primaryFont ||
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
    ],
    [
      "--font-tertiary",
      tertiaryFont || secondaryFont || primaryFont ||
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
    ],
  ].map(([name, value]) => ({ name, value }));

  return (
    <>
      <SiteTheme fonts={font ? [font] : undefined} variables={variables} />
    </>
  );
}

export function Preview(props: Props) {
  return (
    <>
      {
        /* This stylesheet is used to simulate the colors from the admin's color schema (admin's light or dark mode), which are not accessible in the site's color schema.
       * This is a temporary solution until the admin's color schema is accessible.
       * TODO(@carol): Change this temporary solution.
       */
      }
      <style>
        {`
          :root {
            --admin-color-dark-bg: #0d1717;
            --admin-color-light-bg: #ffffff;
            --admin-text-color-dark: #e4e7e7;
            --admin-text-color-light: #162222;
            --admin-border-color-light: #c9cfcf;
            --admin-border-color-dark: #2f3c3c;
            --admin-border-hover-color-light: #819292;
            --admin-border-hover-color-dark: #949e9e;
            --admin-hover-bg-color: #fafafa;
          }

          .dark {
            background-color: var(--admin-color-dark-bg);
            color: var(--admin-text-color-dark);
          }

          .light {
            background-color: var(--admin-color-light-bg);
            color: var(--admin-text-color-light);
          }

          .btn-outline-light, .btn-outline-dark {
            background-color: transparent;
            display: inline-flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            white-space: nowrap;
            border: 1px solid;
            border-radius: 0.5rem;
          }

          .btn-outline-light {
            color: var(--admin-text-color-light);
            border-color: var(--admin-border-color-light);
          }

          .btn-outline-dark {
            color: var(--admin-text-color-dark);
            border-color: var(--admin-border-color-dark);
          }

          .btn-outline-light:hover, .btn-outline-dark:hover {
            background-color: transparent);
            display: inline-flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            white-space: nowrap;
            border-radius: 0.5rem;
          }

          .btn-outline-light:hover {
            border-color: var(--admin-border-hover-color-light);
          }

          .btn-outline-dark:hover {
            border-color: var(--admin-border-hover-color-dark);
          }

          .border-color-dark {
            border-color: var(--admin-border-color-dark);
          }

          .border-color-light {
            border-color: var(--admin-border-color-light);
          }
        `}
      </style>
      <Section {...props} />
      <div class={`flex flex-col gap-4 text-base w-full`}>
        <div>Components and styles</div>
        <div class="flex flex-col w-full gap-2">
          <PreviewContainer
            title="Text colors"
            codeString={snippets.textColors}
          >
            <TextColorsPreview />
          </PreviewContainer>
          <PreviewContainer
            title="Button styles"
            codeString={snippets.buttonStyles}
          >
            <ButtonStylesPreview />
          </PreviewContainer>
          <PreviewContainer
            title="Button colors"
            codeString={snippets.buttonColors}
          >
            <ButtonColorsPreview />
          </PreviewContainer>
          <PreviewContainer
            title="Button sizes"
            codeString={snippets.buttonSizes}
          >
            <ButtonSizesPreview />
          </PreviewContainer>
        </div>
      </div>
      {props.font?.family && (
        <div class="text-center py-2">Font: {props.font.family}</div>
      )}
    </>
  );
}

const ButtonSizesPreview = () => {
  const buttonSizes = {
    lg: "Large",
    md: "Normal",
    sm: "Small",
    xs: "Tiny",
  };

  const buttonStyles = ["", "primary", "secondary", "accent"];

  const renderButtonRow = (style: string) => (
    <div class="flex flex-row gap-2 items-center">
      {Object.entries(buttonSizes).map(([sizeCode, sizeText]) => (
        <button
          class={`btn capitalize btn-${sizeCode} ${
            style ? `btn-${style}` : ""
          }`}
        >
          {sizeText}
        </button>
      ))}
    </div>
  );

  return (
    <div class="bg-base-100 overflow-x-auto rounded-lg flex flex-col p-2 gap-2">
      {buttonStyles.map((style) => renderButtonRow(style))}
    </div>
  );
};

const ButtonColorsPreview = () => {
  const buttonTypesClasses = ["btn", "btn-outline", "btn-ghost", "btn-link"];
  const buttonColorsClasses = [
    "",
    "btn-primary",
    "btn-secondary",
    "btn-accent",
  ];

  const renderButtonRow = (type: string) => (
    <div class="flex flex-row gap-2">
      {buttonColorsClasses.map((color) => (
        <button class={`btn btn-xs md:btn-sm capitalize ${color} ${type}`}>
          {color ? color.split("-")[1] : "Button"}
        </button>
      ))}
    </div>
  );

  return (
    <div class="bg-base-100 overflow-x-auto rounded-lg flex flex-col p-2 gap-2">
      {buttonTypesClasses.map((type) => renderButtonRow(type))}
    </div>
  );
};

const ButtonStylesPreview = () => {
  const buttonStylesClasses = ["", "btn-outline", "btn-ghost", "btn-link"];

  return (
    <div class="bg-base-100 overflow-x-auto rounded-lg flex flex-row p-2 gap-2">
      {buttonStylesClasses.map((style) => (
        <button class={`btn btn-xs md:btn-sm capitalize ${style}`}>
          {style ? style.split("-")[1] : "Button"}
        </button>
      ))}
    </div>
  );
};

const TextColorsPreview = () => {
  const textColorsClasses = [
    "",
    "text-primary",
    "text-secondary",
    "text-accent",
  ];

  return (
    <div class="bg-base-100 overflow-x-auto rounded-lg flex flex-row p-2 gap-2 text-sm md:text-base">
      {textColorsClasses.map((color) => (
        <div class={`${color} capitalize`}>
          {color ? color.split("-")[1] : "Content"}
        </div>
      ))}
    </div>
  );
};

const PreviewContainer = ({
  title,
  children,
  codeString,
}: {
  title: string;
  children: ComponentChildren;
  codeString: string;
}) => {
  const borderClass = "border-color-light";
  const btnOutlineClass = "btn-outline-dark";
  const checkboxId = `show-code-${title.replace(/\s+/g, "-").toLowerCase()}`;
  const codeBlockId = `code-block-${title.replace(/\s+/g, "-").toLowerCase()}`;

  // Estilos dinâmicos adicionados para esconder/mostrar labels baseado no estado do checkbox
  const dynamicStyle = `
    #${codeBlockId} {
      display: none;
    }
    #${checkboxId}:checked ~ #${codeBlockId} {
      display: block;
    }
    #${checkboxId}:checked ~ .show-label {
      display: none;
    }
    #${checkboxId}:not(:checked) ~ .hide-label {
      display: none;
    }
    #${checkboxId}:checked ~ .hide-label {
      background-color: var(--admin-text-color-light)
  };
      color: var(--admin-hover-bg-color)
  };
    }
  `;

  return (
    <>
      <style>{dynamicStyle}</style>
      <div
        class={clx(
          `border p-4 flex flex-col gap-2 grow relative`,
          borderClass,
          `rounded-lg`,
        )}
      >
        <div>
          <div class="my-1">{title}</div>
          <div>
            <input type="checkbox" id={checkboxId} class="sr-only" />
            {/* Label for "Show code" */}
            <label
              htmlFor={checkboxId}
              class={clx(
                `btn-sm absolute right-4 top-4`,
                btnOutlineClass,
                `show-label`,
              )}
            >
              Show code
            </label>
            {/* Label for "Hide code" */}
            <label
              htmlFor={checkboxId}
              class={clx(
                `btn-sm absolute right-4 top-4`,
                btnOutlineClass,
                `hide-label`,
              )}
            >
              Hide code
            </label>
            <div
              id={codeBlockId}
              class={clx("mt-4 mb-2 text-xs md:text-sm bg-slate-100")}
            >
              <pre class="p-4 overflow-x-auto">{codeString}</pre>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

// TODO(@carol): find a way to make these snippets more dynamic
const snippets = {
  textColors: `
  <div>Content</div>
  <div class="text-primary">Primary</div>
  <div class="text-secondary">Secondary</div>
  <div class="text-accent">Accent</div>`,
  buttonStyles: `
  <button class="btn btn-sm">Button</button>
  <button class="btn btn-sm btn-outline">Outline</button>
  <button class="btn btn-sm btn-ghost">Ghost</button>
  <button class="btn btn-sm btn-link">Link</button>`,
  buttonColors: `
  {/* First row */}
  <button class="btn btn-sm">Button</button>
  <button class="btn btn-sm btn-primary">Primary</button>
  <button class="btn btn-sm btn-secondary">Secondary</button>
  <button class="btn btn-sm btn-accent">Accent</button>

  {/* Second row */}
  <button class="btn btn-sm btn-outline">Button</button>
  <button class="btn btn-sm btn-primary btn-outline">Primary</button>
  <button class="btn btn-sm btn-secondary btn-outline">Secondary</button>
  <button class="btn btn-sm btn-accent btn-outline">Accent</button>

  {/* Third row */}
  <button class="btn btn-sm btn-ghost">Button</button>
  <button class="btn btn-sm btn-primary btn-ghost">Primary</button>
  <button class="btn btn-sm btn-secondary btn-ghost">Secondary</button>
  <button class="btn btn-sm btn-accent btn-ghost">Accent</button>

  {/* Fourth row */}
  <button class="btn btn-sm btn-link">Button</button>
  <button class="btn btn-sm btn-primary btn-link">Primary</button>
  <button class="btn btn-sm btn-secondary btn-link">Secondary</button>
  <button class="btn btn-sm btn-accent btn-link">Accent</button>`,
  buttonSizes: `
  {/* First row */}
  <button class="btn btn-lg">Large</button>
  <button class="btn btn-md">Normal</button>
  <button class="btn btn-sm">Small</button>
  <button class="btn btn-xs">Tiny</button>

  {/* Second row */}
  <button class="btn btn-lg btn-primary">Large</button>
  <button class="btn btn-md btn-primary">Normal</button>
  <button class="btn btn-sm btn-primary">Small</button>
  <button class="btn btn-xs btn-primary">Tiny</button>

  {/* Third row */}
  <button class="btn btn-lg btn-secondary">Large</button>
  <button class="btn btn-md btn-secondary">Normal</button>
  <button class="btn btn-sm btn-secondary">Small</button>
  <button class="btn btn-xs btn-secondary">Tiny</button>
  
  {/* Fourth row */}
  <button class="btn btn-lg btn-accent">Large</button>
  <button class="btn btn-md btn-accent">Normal</button>
  <button class="btn btn-sm btn-accent">Small</button>
  <button class="btn btn-xs btn-accent">Tiny</button>`,
};

export default Section;

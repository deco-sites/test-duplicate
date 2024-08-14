const BLOCKS_PATH = ".deco/blocks";
const METADATA_PATH = ".deco/metadata";
const STORE_NAME = "fast-fashion";

const blocks: Record<string, Record<string, string>> = {};
let json = await Deno.readTextFile("old-release.json");

const types = new Set();

try {
  Deno.mkdirSync(BLOCKS_PATH);
} catch (_e) {
  console.log("Blocks folder already exists");
}

try {
  Deno.mkdirSync(METADATA_PATH);
} catch (_e) {
  console.log("Metadata folder already exists");
}

json = json.replaceAll("deco-sites/fast-fashion/", "site/");

Object.entries(
  JSON.parse(json) as Record<
    string,
    { path: string; name: string; __resolveType: string }
  >,
).forEach(
  async ([key, value]) => {
    const encodedPath = `${BLOCKS_PATH}/${encodeURIComponent(key)}.json`;
    const resolveType = value.__resolveType;
    let blockType = resolveType.split("/")[1];

    if (blockType === STORE_NAME) blockType = resolveType.split("/")[2];

    types.add(blockType);

    if (blockType === "pages") {
      blocks["/" + encodedPath] = {
        path: value.path,
        name: value.name,
        blockType: blockType,
        __resolveType: resolveType,
      };
    } else {
      blocks["/" + encodedPath] = {
        blockType: blockType,
        __resolveType: resolveType,
      };
    }

    await Deno.writeTextFile(
      encodedPath,
      JSON.stringify({ ...value, __resolveType: resolveType }),
    );
  },
);

await Deno.writeTextFile(
  `${METADATA_PATH}/blocks.json`,
  JSON.stringify(blocks, null, 2),
);

console.log(types);

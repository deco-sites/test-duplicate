import { walkSync } from "std/fs/mod.ts";

const BLOCKS_PATH = ".deco/blocks";
const BLOCKS_FILE_PATH = ".deco/metadata/blocks.json";
const SECTIONS_PATH = "sections";

const getUsedSections = () => {
  const dir = Deno.readDirSync(BLOCKS_PATH);
  const resolveTypes = new Set<string>();
  const files = new Set<string>();

  for (const file of dir) {
    files.add(file.name);
  }

  for (const file of Array.from(files)) {
    if (!file.includes("pages") && !file.includes("site")) continue;

    const filePath = `${BLOCKS_PATH}/${file}`;
    const content = Deno.readTextFileSync(filePath);
    const formattedContent = JSON.stringify(JSON.parse(content), null, 2);
    const fileResolveTypes = formattedContent
      .split("\n")
      .reduce((acc, line) => {
        if (line.includes("__resolveType")) {
          acc.push(
            line.split(":")[1].trim().replace(/"/g, "").replace(",", ""),
          );
        }

        return acc;
      }, [] as string[]);

    for (const fileResolveType of fileResolveTypes) {
      const file = files.has(`${encodeURI(fileResolveType)}.json`);

      if (file) {
        const content = Deno.readTextFileSync(
          `${BLOCKS_PATH}/${encodeURI(fileResolveType)}.json`,
        );
        const { __resolveType } = JSON.parse(content);

        resolveTypes.add(__resolveType);
      } else {
        resolveTypes.add(fileResolveType);
      }
    }
  }

  // removes non section resolve types
  for (const resolveType of Array.from(resolveTypes)) {
    if (!resolveType.startsWith("site/sections/")) {
      resolveTypes.delete(resolveType);
    }
  }

  return Array.from(resolveTypes).map((resolveType) =>
    resolveType.replace("site/sections", SECTIONS_PATH)
  );
};

const getAvailableSections = () => {
  const dir = walkSync(SECTIONS_PATH, { includeDirs: false });
  const sections = new Set<string>();

  for (const file of dir) {
    sections.add(file.path);
  }

  return Array.from(sections);
};

const removeUnusedSections = () => {
  const usedSections = getUsedSections();
  const availableSections = getAvailableSections();
  const removedSections = new Set<string>();
  const blockFiles = Deno.readDirSync(BLOCKS_PATH);
  const blocksFile = Deno.readTextFileSync(BLOCKS_FILE_PATH);
  const blocksContent = new Map<string, string>(
    Object.entries(JSON.parse(blocksFile)),
  );

  for (const section of availableSections) {
    if (!usedSections.includes(section)) {
      Deno.removeSync(section);
      removedSections.add(section);

      console.log(`Removed: ${section}`);
    }
  }

  if (removedSections.size === 0) {
    console.log("No unused sections to remove.");
  }

  for (const blockFile of blockFiles) {
    const blockContent = Deno.readTextFileSync(
      `${BLOCKS_PATH}/${blockFile.name}`,
    );
    const { __resolveType } = JSON.parse(blockContent);
    const resolveType = __resolveType.replace("site/sections", SECTIONS_PATH);

    if (removedSections.has(resolveType)) {
      Deno.removeSync(`${BLOCKS_PATH}/${blockFile.name}`);
      blocksContent.delete(`/.deco/blocks/${blockFile.name}`);
      console.log(`Removed: ${blockFile.name}`);
    }
  }
};

removeUnusedSections();

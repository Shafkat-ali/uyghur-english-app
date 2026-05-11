import fs from "fs";

const SOURCE_URL =
  "https://raw.githubusercontent.com/Uyghur-LRs/Uyghur-Wordlist/master/Sozler_350000.txt";

const OUTPUT_FILE = "src/data/uyghurWords.js";

const LEVEL_LIMITS = {
  beginner: 1000,
  intermediate: 3000,
  advanced: 5000,
};

function getLevel(index) {
  if (index < LEVEL_LIMITS.beginner) return "beginner";
  if (index < LEVEL_LIMITS.intermediate) return "intermediate";
  return "advanced";
}

async function main() {
  console.log("Downloading Uyghur wordlist...");

  const res = await fetch(SOURCE_URL);
  const text = await res.text();

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const words = lines
    .map((line, index) => {
      const parts = line.split(",");
      const uyghur = parts[0]?.trim();

      if (!uyghur) return null;

      return {
        id: index + 1,
        uyghur,
        english: "",
        level: getLevel(index),
        category: "dictionary",
        source: "Uyghur-LRs/Uyghur-Wordlist",
      };
    })
    .filter(Boolean)
    .slice(0, 5000);

  const fileContent = `
// Auto-generated file. Do not manually edit.
// Source: https://github.com/Uyghur-LRs/Uyghur-Wordlist
// License: Creative Commons Attribution 4.0 International

export const uyghurWords = ${JSON.stringify(words, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");

  console.log(`Done. Generated ${words.length} words into ${OUTPUT_FILE}`);
}

main();
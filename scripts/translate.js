import { program } from "commander";
import * as dotenv from "dotenv";
import { readFile, writeFile } from "node:fs/promises";
import fetch from "node-fetch";

dotenv.config();

/**
 * @typedef { import("../types").TranslationUnit } TranslationUnit
 */

/**
 * @param {TranslationUnit} unit
 */
async function translateDeepl(unit) {
  const authKey = process.env.DEEPL_AUTH_KEY;
  const response = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      "Authorization": `DeepL-Auth-Key ${authKey}`
    },
    body: new URLSearchParams({
      text: unit.source,
      source_lang: "EN",
      target_lang: "CS"
    })
  });
  const data = await response.json();
  unit.deepl = data.translations?.[0].text;
}

program
  .name("machine translation")
  .argument("<path>", "translation units JSON")
  .option("-i, --in-place", "add translations to the source file")
  .option("-t, --type <type>", "translation type", "deepl")
  .action(async (source, { type, inPlace }) => {
    const units = JSON.parse(await readFile(source, "utf-8"));
    for (const unit of units) {
      if (!type || type === "deepl") await translateDeepl(unit);
    }
    if (inPlace) {
      await writeFile(source, JSON.stringify(units, null, "  "));
    } else {
      console.log(JSON.stringify(units, null, "  "));
    }
  });

program.parse();

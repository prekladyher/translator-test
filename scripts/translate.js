import { program } from "commander";
import * as dotenv from "dotenv";
import { readFile, writeFile } from "node:fs/promises";
import fetch from "node-fetch";
import { TranslationServiceClient } from "@google-cloud/translate";

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
  return data.translations?.[0].text;
}

/**
 * @param {TranslationUnit} unit
 */
async function translateLindat(unit) {
  const response = await fetch("https://lindat.mff.cuni.cz/services/translation/api/v2/languages/?src=en&tgt=cs", {
    method: "POST",
    headers: {
      "Accept": "application/json"
    },
    body: new URLSearchParams({
      input_text: unit.source
    })
  });
  const data = await response.json();
  return data?.join(" ").trim();
}

const translationClient = new TranslationServiceClient();

/**
 * @param {TranslationUnit} unit
 */
async function translateGoogle(unit) {
  const credentials = JSON.parse(await readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf-8"));
  const request = {
    parent: `projects/${credentials.project_id}/locations/global`,
    contents: [unit.source],
    mimeType: 'text/plain',
    sourceLanguageCode: 'en',
    targetLanguageCode: 'cs',
  };
  const [ response ] = await translationClient.translateText(request);
  return response.translations?.[0].translatedText;
}

/**
 * @type {Record<string, (TranslationUnit) => Promise<string|undefined>}
 */
const TRANSLATORS = {

  deepl: translateDeepl,

  lindat: translateLindat,

  google: translateGoogle

};

/**
 * @param {string[]} types
 * @param {TranslationUnit} unit
 * @param {boolean} reload
 */
async function translate(types, unit, reload) {
  for (const type of types) {
    if (!reload && unit[type]) {
      continue; // translation already fetched
    }
    unit[type] = await TRANSLATORS[type](unit);
  }
}

program
  .name("machine translation")
  .argument("<path>", "translation units JSON")
  .option("-i, --in-place", "add translations to the source file")
  .option("-r, --reload", "whether to reload existing translations")
  .option("-t, --type <type>", "translation type")
  .action(async (source, { type, inPlace, reload }) => {
    const units = JSON.parse(await readFile(source, "utf-8"));
    const types = type ? [type] : Object.keys(TRANSLATORS);
    for (const unit of units) {
      await translate(types, unit, reload);
    }
    if (inPlace) {
      await writeFile(source, JSON.stringify(units, null, "  "));
    } else {
      console.log(JSON.stringify(units, null, "  "));
    }
  });

program.parse();

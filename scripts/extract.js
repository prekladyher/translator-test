import { decodeEntries } from "@prekladyher/l10n-toolbox-gettext";
import { program } from "commander";
import glob from "fast-glob";
import { readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { parseString } from "xml2js";

/**
 * @typedef { import("../types").TranslationUnit } TranslationUnit
 */

async function writeOutput(data) {
  const { output } = program.opts();
  if (output) {
    await writeFile(output, JSON.stringify(data, null, "  "));
  } else {
    console.log(JSON.stringify(data, null, "  "));
  }
}

program
  .name("translation units extraction")
  .option("-o, --output <path>", "output file");

program
  .command("fallout")
  .description("extract Fallout 4 translation")
  .argument("<path>", "source translation project path")
  .action(async (source) => {
    /** @type {TranslationUnit[]} */
    const units = [];
    for (const file of await glob("source/l10n/**/*.xml", { cwd: source, absolute: true })) {
      const catalogue = await promisify(parseString)(await readFile(file, "utf-8"));
      for (const string of catalogue.SSTXMLRessources.Content?.[0].String || []) {
        if (string.$.Partial === "1" || !string.Dest?.[0] || string.Dest[0].match(/^\s+$/)) {
          continue; // ignore partial or empty translations
        }
        units.push({
          id: `${string.EDID}/${string.$.sID}`,
          source: string.Source[0],
          target: string.Dest[0]
        });
      }
    }
    await writeOutput(units);
  });

program
  .command("disco")
  .description("extract Disco Elysium translation")
  .argument("<path>", "source translation project path")
  .action(async (source) => {
      /** @type {TranslationUnit[]} */
      const units = [];
      for (const file of await glob("source/l10n/cs/**/*.po", { cwd: source, absolute: true })) {
        const entries = decodeEntries(await readFile(file, "utf-8"));
        for (const entry of entries) {
          if (!entry.msgid || !entry.msgstr || entry["#,"]?.indexOf("fuzzy") >= 0) {
            continue; // ignore partial or empty translations
          }
          if (/^Conversation\/0x[0-9A-F]+\/Title$/.test(entry.msgctxt)) {
            continue; // ignore conversation titles
          }
          units.push({
            id: entry.msgctxt,
            source: entry.msgid,
            target: entry.msgstr
          });
        }
      }
      await writeOutput(units);
  });

program
  .command("random")
  .description("extract random translation units")
  .argument("<path>", "source translation file")
  .option("-n, --number <count>", "number of units to extract", 20)
  .action(async (source, { number: count }) => {
    const units = JSON.parse(await readFile(source, "utf-8"));
    for (let i = 0; i < count; i++) {
      const pick = Math.floor(Math.random() * (units.length - i));
      const temp = units[i];
      units[i] = units[pick];
      units[pick] = temp;
    }
    await writeOutput(units.slice(0, count));
  });

program.parse();

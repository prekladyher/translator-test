import { program } from "commander";
import { readFile, stat, writeFile } from "node:fs/promises"
import glob from "fast-glob";
import { join } from "node:path";
import { promisify } from "node:util";
import { parseString } from "xml2js";

/**
 * @typedef { import("../types").TranslationUnit } TranslationUnit
 */

/**
 * @param {TranslationUnit[]} units
 */
async function writeUnits(output, units) {
  if (output) {
    await writeFile(output, JSON.stringify(units, null, "  "));
  } else {
    console.log(JSON.stringify(units, null, "  "));
  }
}

program
  .name("asd")
  .option("-o, --output <path>", "output file");

program
  .command("fallout")
  .description("extract Fallout 4 translation")
  .argument("<path>", "source translation project path")
  .action(async (source) => {
    /** @type {TranslationUnit[]} */
    const units = [];
    parseString("../fallout4-preklad/source/l10n/Fallout4_VR/noinfo-edids-00.xml", () => {});
    for (const file of await glob(join(source, "source/l10n/**/*.xml"))) {
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
    const { output } = program.opts();
    await writeUnits(output, units);
  });

program
  .command("disco")
  .description("extract Disco Elysium translation")
  .argument("<path>", "source translation project path")
  .action(({ output }) => {
    // TODO nacteni Disco prekladu
  });

program.parse();

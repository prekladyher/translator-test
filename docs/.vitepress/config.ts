import { fileURLToPath } from "url";
import { defineConfig } from "vitepress";

export default defineConfig({
    title: "Translator Test",
    description: "Research project for machine translation based game localization.",
    appearance: "dark",
    base: "/translator-test/",
    themeConfig: {
      logo: "/logo.png",
      darkModeSwitchLabel: "Vzhled",
      outline: {
        label: "Obsah"
      },
      sidebar: [
        {
          text: "Náhodný výběr",
          items: [
            {
              text: "Disco Elysium",
              link: "/disco"
            },
            {
              text: "Fallout 4",
              link: "/fallout"
            }
          ]
        }
      ],
      socialLinks: [
        { icon: 'github', link: 'https://github.com/prekladyher/translator-test' }
      ],
    },
    vite: {
      resolve: {
        alias: {
          "@": fileURLToPath(new URL("../..", import.meta.url))
        }
      }
    },
});

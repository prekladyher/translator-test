import { defineConfig } from "vitepress";

export default defineConfig({
    title: "PH Squad",
    appearance: "dark",
    base: "/translator-test/",
    themeConfig: {
        darkModeSwitchLabel: "Vzhled",
        outline: {
            label: "Obsah"
        }
    }
});

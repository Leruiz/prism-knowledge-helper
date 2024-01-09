import { chromeExtension } from "vite-plugin-chrome-extension";
import { defineConfig } from "vite";
import jsx from '@vitejs/plugin-vue-jsx';
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    build: {
        rollupOptions: {
            input: "src/manifest.json",
        },
    },
    plugins: [
        vue(),
        jsx(),
        chromeExtension(),
    ]
})

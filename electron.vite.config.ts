import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {
	defineConfig,
	defineViteConfig,
	externalizeDepsPlugin,
} from "electron-vite";

export default defineConfig({
	main: {
		envPrefix: ["VITE_"],
		plugins: [externalizeDepsPlugin()],
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
	},
	renderer: defineViteConfig(() => {
		return {
			server: {
				port: 2214,
			},
			resolve: {
				alias: {
					"@renderer": resolve("src/renderer/src"),
					"@assets": resolve("src/renderer/src/assets"),
				},
			},
			plugins: [react(), tailwindcss()],
		};
	}),
});

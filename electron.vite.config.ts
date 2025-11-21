import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import 'dotenv/config';
import {
	defineConfig,
	defineViteConfig,
	externalizeDepsPlugin,
} from "electron-vite";
import { resolve } from "node:path";

export default defineConfig({
	main: {
		envPrefix: ["VITE_"],
		plugins: [externalizeDepsPlugin()],
		define: {
			"process.env.API_KEY": JSON.stringify(process.env.MAIN_VITE_API_KEY),
			"process.env.LOCAL_API_KEY": JSON.stringify(process.env.MAIN_VITE_LOCAL_API_KEY),
		},
		resolve: {
			alias: {
				"@": resolve("src/main"),
				"@resources": resolve("resources"),
			},
		},
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
	},
	renderer: defineViteConfig(() => ({
		define: {
			"import.meta.env.LOCAL_API_KEY": JSON.stringify(process.env.MAIN_VITE_LOCAL_API_KEY),
		},
		server: {
			port: 2214,
		},
		resolve: {
			alias: {
				"@": resolve("src/renderer/src"),
				"@assets": resolve("src/renderer/src/assets"),
			},
		},
		plugins: [react(), tailwindcss()],
	})),
});

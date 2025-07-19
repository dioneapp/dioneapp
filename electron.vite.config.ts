import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {
	defineConfig,
	defineViteConfig,
	externalizeDepsPlugin,
} from "electron-vite";
import 'dotenv/config';

export default defineConfig({
	main: {
		envPrefix: ["VITE_"],
		plugins: [externalizeDepsPlugin()],
		define: {
			"process.env.API_KEY": JSON.stringify(process.env.MAIN_VITE_API_KEY),
			"process.env.LOCAL_API_KEY": JSON.stringify(process.env.MAIN_VITE_LOCAL_API_KEY),
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
				"@renderer": resolve("src/renderer/src"),
				"@assets": resolve("src/renderer/src/assets"),
			},
		},
		plugins: [react(), tailwindcss()],
	})),
});

/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_DB_URL: string;
	readonly VITE_DB_KEY: string;
	readonly VITE_DISCORD_WEBHOOK_URL: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

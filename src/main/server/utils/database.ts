/// <reference types="vite/client" /> interface ImportMeta {     readonly env: ImportMetaEnv }

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(import.meta.env.VITE_DB_URL, import.meta.env.VITE_DB_KEY, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: false,
	},
});
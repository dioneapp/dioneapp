/// <reference types="vite/client" />

import logger from "@/server/utils/logger";
import { createClient } from "@supabase/supabase-js";

let supabase: ReturnType<typeof createClient> | null = null;

try {
	if (!import.meta.env.VITE_DB_URL || !import.meta.env.VITE_DB_KEY) {
		logger.warn(
			"Supabase not initialized: If you are in DEV mode remember, functions like AUTH are not available. If you want to use your own database, set VITE_DB_URL and VITE_DB_KEY in your .env file.",
		);
	} else {
		supabase = createClient(
			import.meta.env.VITE_DB_URL,
			import.meta.env.VITE_DB_KEY,
			{
				auth: {
					persistSession: true,
					autoRefreshToken: true,
					detectSessionInUrl: false,
				},
			},
		);
	}
} catch (error) {
	logger.error("Failed to initialize supabase:", error);
}

export { supabase };

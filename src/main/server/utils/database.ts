/// <reference types="vite/client" /> interface ImportMeta {     readonly env: ImportMetaEnv }

import { createClient } from "@supabase/supabase-js";

const hasSupabaseConfig = import.meta.env.VITE_DB_URL && import.meta.env.VITE_DB_KEY;

export const supabase = hasSupabaseConfig
	? createClient(import.meta.env.VITE_DB_URL, import.meta.env.VITE_DB_KEY, {
			auth: {
				persistSession: true,
				autoRefreshToken: true,
				detectSessionInUrl: false,
			},
		})
	: null;

export const isSupabaseConfigured = () => hasSupabaseConfig;

export const safeSupabaseOperation = async <T>(
	operation: () => Promise<{ data: T | null; error: any }>,
	fallbackValue: T
): Promise<{ data: T | null; error: any }> => {
	if (!hasSupabaseConfig) {
		return { data: fallbackValue, error: null };
	}
	return operation();
};

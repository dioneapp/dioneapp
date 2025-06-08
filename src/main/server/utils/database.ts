/// <reference types="vite/client" />

import { createClient } from "@supabase/supabase-js";
import logger from "./logger";

let supabase: ReturnType<typeof createClient> | null = null;

try {
  if (!import.meta.env.VITE_DB_URL || !import.meta.env.VITE_DB_KEY) {
    logger.warn('Supabase not initialized: Missing required environment variables VITE_DB_URL or VITE_DB_KEY');
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
  logger.error('Failed to initialize supabase:', error);
}

export { supabase };

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DB_URL: string
    readonly VITE_DB_KEY: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
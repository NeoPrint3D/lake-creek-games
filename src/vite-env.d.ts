/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_AUTH_DOM: string;
  readonly VITE_PRJ_ID: string;
  readonly VITE_STG_BKT: string;
  readonly VITE_MSG_ID: string;
  readonly VITE_APP_ID: string;
  readonly VITE_MESG_ID: string;
  readonly VITE_ADMIN_UID: string;
  readonly VITE_HASH_KEY: string;
  readonly VITE_EMAIL_API_KEY: string;
  readonly VITE_API_SYNC_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

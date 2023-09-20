namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    DATABASE_URL: string;
    NEXTAUTH_SECRET: string;
    API_BASE_URL: string;
  }
}

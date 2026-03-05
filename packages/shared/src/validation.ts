import { z } from "zod";

export const EnvWebSchema = z.object({
  NEXT_PUBLIC_API_ORIGIN: z.string().url(),
  NEXT_PUBLIC_ROOT_DOMAIN: z.string().min(1)
});

export const EnvApiSchema = z.object({
  ROOT_DOMAIN: z.string().min(1),
  WEB_ORIGIN: z.string().url(),
  SESSION_COOKIE_NAME: z.string().min(1),
  SESSION_SIGNING_KEY: z.string().min(32),
  AZURE_TENANT_ID: z.string().min(1),
  AZURE_CLIENT_ID: z.string().min(1),
  AZURE_CLIENT_SECRET: z.string().min(1),
  AZURE_REDIRECT_URI: z.string().url(),
  DATABASE_URL: z.string().min(1)
});

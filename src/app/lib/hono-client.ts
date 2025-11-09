import { hc } from "hono/client";
import type { pub } from "@/server/hono";

type AppType = typeof pub;

export const hono = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL as string);

import { hc } from "hono/client";
import type { pub } from "@/server/hono";

type AppType = typeof pub;

export const hono = hc<AppType>("https://goodle-forme.vercel.app");

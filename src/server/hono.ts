import { Hono } from "hono";
import { publicRoutes } from "./routes/public.route";
// import { HonoBase } from "hono/hono-base";
// import { BlankEnv, BlankSchema } from "hono/types";

export const app = new Hono().basePath("/api");
// app.get(
//   "/openapi",
//   openAPIRouteHandler(app, {
//     documentation: {
//       info: {
//         title: "My API",
//         version: "1.0.0",
//         description: "Valibot + hono-openapi example",
//       },
//       servers: [{ url: "http://localhost:3000", description: "Local" }],
//     },
//   }),
// );

// app.get(
//   "/docs",
//   Scalar({
//     url: "/api/openapi",
//     theme: "alternate",
//     layout: "modern",
//   }),
// );
export const pub = app.route("/",publicRoutes)

// function openAPIRouteHandler(app: HonoBase<BlankEnv, BlankSchema, "/api">, arg1: { documentation: { info: { title: string; version: string; description: string; }; servers: { url: string; description: string; }[]; }; }): import("hono/types").H<import("hono/types").BlankEnv, "/api/openapi", import("hono/types").BlankInput, any> {
//     throw new Error("Function not implemented.");
// }
// function Scalar(arg0: { url: string; theme: string; layout: string; }): import("hono/types").H<BlankEnv, "/api/docs", import("hono/types").BlankInput, any> {
//     throw new Error("Function not implemented.");
// }


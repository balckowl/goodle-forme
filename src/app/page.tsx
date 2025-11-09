import type { FeatureFlags } from "@/server/schemas/admin.schema";
import FormWrapper from "./components/FormWrapper";
// import { hono } from "./lib/hono-client";

export default async function Page() {
  // const res = await hono.api.allFlags.$get();
  // const flags = await res.json();

  const flags: FeatureFlags = {
    isFormeBoldness: true,
    isFormeCreativity: true,
    isFormeExecution: true,
    isFormeHumor: true,
    isFormePresentation: true,
  };

  return <FormWrapper flags={flags} />;
}

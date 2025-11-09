import type { FeatureFlags } from "@/server/schemas/admin.schema";
import AdminWrapper from "../components/AdminWrapper";

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

  return <AdminWrapper flags={flags} />;
}

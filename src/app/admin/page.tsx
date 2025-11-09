import { db } from "@/db";
import AdminWrapper from "../components/AdminWrapper";

export default async function Page() {
  const allFlags = await db.query.featureFlags.findMany()

  // if (res.status !== 200) {
  //   throw Error("何かの問題が発生しました。")
  // }

  // const flags = await res.json();

  // const flags: FeatureFlags = {
  //   isFormeBoldness: true,
  //   isFormeCreativity: true,
  //   isFormeExecution: true,
  //   isFormeHumor: true,
  //   isFormePresentation: true,
  // };

  return <AdminWrapper flags={allFlags[0]} />;
}

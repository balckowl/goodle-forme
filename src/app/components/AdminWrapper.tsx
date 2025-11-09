"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { FeatureFlags } from "@/server/schemas/admin.schema";
import { hono } from "../lib/hono-client";

const flagDefinitions = [
  { key: "isFormeBoldness", label: "Boldness of Theft" },
  { key: "isFormeExecution", label: "Execution & Improvement" },
  { key: "isFormeHumor", label: "Humor / Branding" },
  { key: "isFormeCreativity", label: "Creativity in Rebranding" },
  { key: "isFormePresentation", label: "Presentation" },
] as const;

type FlagKey = (typeof flagDefinitions)[number]["key"];
type FlagState = Record<FlagKey, boolean>;

const deriveFlagState = (source: FeatureFlags): FlagState =>
  flagDefinitions.reduce((acc, flag) => {
    acc[flag.key] = source[flag.key];
    return acc;
  }, {} as FlagState);

const flagMutations: Record<FlagKey, (value: boolean) => Promise<Response>> = {
  isFormeBoldness: (value) =>
    hono.api.isformeboldness.$put({
      json: { isFormeBoldness: value },
    }),
  isFormeExecution: (value) =>
    hono.api.isformeexecution.$put({
      json: { isFormeExecution: value },
    }),
  isFormeHumor: (value) =>
    hono.api.isformehumor.$put({
      json: { isFormeHumor: value },
    }),
  isFormeCreativity: (value) =>
    hono.api.isformecreativity.$put({
      json: { isFormeCreativity: value },
    }),
  isFormePresentation: (value) =>
    hono.api.isformepresentation.$put({
      json: { isFormePresentation: value },
    }),
};

export default function AdminWrapper({
  flags: allFlags,
}: {
  flags: FeatureFlags;
}) {
  const [flags, setFlags] = useState<FlagState>(() =>
    deriveFlagState(allFlags),
  );

  useEffect(() => {
    setFlags(deriveFlagState(allFlags));
  }, [allFlags]);

  const sendFlagUpdate = useCallback(
    async (key: FlagKey, nextValue: boolean, previousValue: boolean) => {
      try {
        await flagMutations[key](nextValue);
        console.log(`[Admin] ${key}:`, nextValue);
      } catch (error) {
        console.error(`[Admin] Failed to update ${key}`, error);
        setFlags((prev) => ({ ...prev, [key]: previousValue }));
      }
    },
    [],
  );

  const handleToggle = useCallback(
    (key: FlagKey) => {
      setFlags((prev) => {
        const previousValue = prev[key];
        const nextValue = !previousValue;
        void sendFlagUpdate(key, nextValue, previousValue);
        return { ...prev, [key]: nextValue };
      });
    },
    [sendFlagUpdate],
  );

  return (
    <main className="min-h-screen bg-[#ede7f6] p-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-xl border border-[#dadce0] bg-white p-8 mb-5">
          <header className="mb-6">
            <p className="text-lg font-semibold text-[#202124]">
              Magical Power
            </p>
            <p className="text-sm text-[#5f6368]">
              Turn on the section you want to give the highest rating. You can
              force it to be the highest rating.
            </p>
          </header>
          <div className="flex flex-wrap gap-4">
            {flagDefinitions.map(({ key, label }) => {
              const isEnabled = flags[key];
              return (
                <article
                  key={key}
                  className="flex grow basis-64 items-center justify-between rounded-2xl border border-[#dadce0] px-4 py-3"
                >
                  <span className="text-sm font-medium text-[#202124]">
                    {label}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    aria-label={label}
                    onClick={() => handleToggle(key)}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${isEnabled ? "bg-[#673ab7]" : "bg-[#ccd0d5]"}`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${isEnabled ? "translate-x-5" : "translate-x-1"}`}
                    />
                  </button>
                </article>
              );
            })}
          </div>
        </section>
        <Link
          href="/"
          className="inline-flex
             cursor-pointer 
             items-center 
             gap-2 rounded-xl bg-[#673ab7] px-6 py-2 text-sm font-semibold
            text-white transition
            hover:bg-[#5e35b1] disabled:cursor-progress 
            disabled:opacity-70"
        >
          <span>Back to form</span>
        </Link>
      </div>
    </main>
  );
}

"use client";

import dynamic from "next/dynamic";

const IntroExperience = dynamic(
  () => import("./IntroExperience").then((module) => module.IntroExperience),
  { ssr: false },
);

export function IntroMount() {
  return <IntroExperience />;
}

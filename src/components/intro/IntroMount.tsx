"use client";

import dynamic from "next/dynamic";

const IntroExperience = dynamic(
  () => import("./IntroExperience").then((module) => module.IntroExperience),
  {
    ssr: false,
    loading: () => <div className="intro-loading-shell" aria-hidden="true" />,
  },
);

export function IntroMount() {
  return <IntroExperience />;
}

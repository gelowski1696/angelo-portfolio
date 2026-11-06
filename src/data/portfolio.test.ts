import { describe, expect, it } from "vitest";
import {
  getConfiguredSocialLinks,
  getPublishedProjects,
  portfolio,
} from "./portfolio";

describe("portfolio configuration", () => {
  it("publishes the configured professional links", () => {
    expect(getConfiguredSocialLinks(portfolio.social)).toEqual([
      {
        key: "github",
        label: "GitHub",
        url: "https://github.com/gelowski1696",
      },
      {
        key: "linkedin",
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/angelo-luzong-9b1125274/",
      },
    ]);
  });

  it("publishes the complete project collection without placeholder labels", () => {
    const projects = getPublishedProjects(portfolio.projects);

    expect(projects).toHaveLength(8);
    expect(projects.every((project) => !project.isPlaceholder)).toBe(true);
    expect(projects.map((project) => project.slug)).toEqual([
      "vmjamtech-vpos",
      "vmjam-sales",
      "aurelia-developments",
      "jocel-beauty-lounge",
      "ligaya-guitars",
      "eliseas-events",
      "cirok-tagaytay",
      "johns-airsoft-storefront",
    ]);
  });

  it("exposes only verified public project destinations", () => {
    const projects = getPublishedProjects(portfolio.projects);

    expect(projects[0].demoUrl).toBe("https://vmjamtech.com/");
    expect(projects[1].demoUrl).toBe("https://vmjamdocuai.cloud/");
    expect(projects[1].linkNote).toContain("Private deployment");
    expect(projects.map((project) => project.demoUrl)).toEqual([
      "https://vmjamtech.com/",
      "https://vmjamdocuai.cloud/",
      "https://real-state-web-delta.vercel.app/",
      "https://jocel-beauty-lounge.vercel.app/",
      "https://ligayaguitars.vercel.app/",
      "https://eliseasevents.vercel.app/",
      "https://ciroktagaytay.vercel.app/",
      "https://johnsairsoft-storefront.vercel.app/",
    ]);
    expect(projects.map((project) => project.image)).toEqual([
      "/images/projects/vpos-overview.png",
      "/images/projects/vmjam-sales-landing.png",
      "/images/projects/aurelia-developments.png",
      "/images/projects/jocel-beauty-lounge.png",
      "/images/projects/ligaya-guitars.png",
      "/images/projects/eliseas-events.png",
      "/images/projects/cirok-tagaytay.png",
      "/images/projects/johns-airsoft.png",
    ]);
  });

  it("includes configured contact and work history", () => {
    expect(portfolio.email).toBe("luzongangelo1996@gmail.com");
    expect(portfolio.resumeUrl).toMatch(/^https:\/\/docs\.google\.com\//);
    expect(portfolio.experience).toHaveLength(3);
    expect(portfolio.experience.every((item) => !item.isPlaceholder)).toBe(true);
  });
});

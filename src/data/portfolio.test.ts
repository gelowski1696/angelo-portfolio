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

  it("publishes three real projects without placeholder labels", () => {
    const projects = getPublishedProjects(portfolio.projects);

    expect(projects).toHaveLength(3);
    expect(projects.every((project) => !project.isPlaceholder)).toBe(true);
    expect(projects.map((project) => project.slug)).toEqual([
      "vmjamtech-vpos",
      "docuai",
      "vmjam-sales",
    ]);
  });

  it("exposes only verified public project destinations", () => {
    const projects = getPublishedProjects(portfolio.projects);

    expect(projects[0].demoUrl).toBe("https://vmjamtech.com/");
    expect(projects[1].demoUrl).toBe("");
    expect(projects[2].linkNote).toContain("Private deployment");
  });

  it("includes configured contact and work history", () => {
    expect(portfolio.email).toBe("luzongangelo1996@gmail.com");
    expect(portfolio.resumeUrl).toMatch(/^https:\/\/docs\.google\.com\//);
    expect(portfolio.experience).toHaveLength(3);
    expect(portfolio.experience.every((item) => !item.isPlaceholder)).toBe(true);
  });
});

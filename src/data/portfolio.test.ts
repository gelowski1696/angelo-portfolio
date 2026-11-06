import { describe, expect, it } from "vitest";
import {
  getConfiguredSocialLinks,
  getPublishedProjects,
  portfolio,
} from "./portfolio";

describe("portfolio configuration", () => {
  it("omits social links that have not been configured", () => {
    expect(getConfiguredSocialLinks(portfolio.social)).toEqual([]);
  });

  it("keeps sample projects visibly identified as placeholders", () => {
    const projects = getPublishedProjects(portfolio.projects);

    expect(projects).toHaveLength(3);
    expect(projects.every((project) => project.isPlaceholder)).toBe(true);
    expect(projects.every((project) => project.label === "Sample / Replace me")).toBe(
      true,
    );
  });

  it("does not expose empty demo or source links", () => {
    const projects = getPublishedProjects(portfolio.projects);

    expect(
      projects.every((project) => !project.demoUrl && !project.repoUrl),
    ).toBe(true);
  });
});


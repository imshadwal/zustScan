import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/login-id";
import {
  eventsPagePath,
  productBrochurePath,
  productPagePath,
  whoItsForPagePath,
  whyDifferentPagePath,
} from "@/lib/site";

const paths = [
  "/",
  productPagePath,
  whyDifferentPagePath,
  whoItsForPagePath,
  eventsPagePath,
  "/pricing",
  "/contact",
  productBrochurePath,
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  const lastModified = new Date();
  return paths.map((path) => ({
    url: path === "/" ? `${origin}/` : `${origin}${path}`,
    lastModified,
    changeFrequency: path === "/" || path === "/pricing" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/pricing" ? 0.9 : 0.7,
  }));
}

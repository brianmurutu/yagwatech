import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { projects } from "@/lib/projects";
import { blogPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/pricing",
    "/blog",
    "/careers",
    "/faqs",
    "/contact",
    "/get-quote",
    "/privacy-policy",
    "/terms-conditions",
  ].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${site.url}/portfolio/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...blogRoutes];
}

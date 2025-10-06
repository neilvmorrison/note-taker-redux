"use client";

import { usePathname, useParams } from "next/navigation";
import { useMemo } from "react";

type Breadcrumb = {
  label: string;
  href: string;
  isCurrent: boolean;
};

type BreadcrumbOptions = {
  /**
   * Custom labels for path segments
   * @example { 'notes': 'My Notes', 'projects': 'My Projects' }
   */
  labels?: Record<string, string>;

  /**
   * Paths to exclude from breadcrumbs
   * @example ['(dashboard)']
   */
  exclude?: string[];

  /**
   * Function to transform dynamic parameters to readable labels
   * @example (param, segment) => param === 'id' ? `Item ${segment}` : segment
   */
  transformParam?: (param: string, value: string) => string;
};

/**
 * Hook to generate breadcrumbs based on the current route
 */
export const useBreadcrumb = (
  options: BreadcrumbOptions = {}
): Breadcrumb[] => {
  const pathname = usePathname();
  const params = useParams();

  const {
    labels = {},
    exclude = ["(dashboard)"],
    transformParam = (param, value) => value,
  } = options;

  return useMemo(() => {
    if (!pathname) return [];

    // Split the pathname into segments
    const segments = pathname.split("/").filter(Boolean);

    // Start with home
    const breadcrumbs: Breadcrumb[] = [
      { label: "Home", href: "/", isCurrent: segments.length === 0 },
    ];

    // Build breadcrumbs for each segment
    let currentPath = "";

    segments.forEach((segment, index) => {
      // Skip excluded segments
      if (exclude.includes(segment)) {
        return;
      }

      currentPath += `/${segment}`;

      // Check if this is a dynamic segment (e.g., [id])
      const isDynamicSegment = segment.startsWith("[") && segment.endsWith("]");
      let finalSegment = segment;
      let href = currentPath;

      if (isDynamicSegment) {
        // Extract the parameter name without brackets
        const paramName = segment.slice(1, -1);
        const paramValue = params[paramName] as string;

        if (paramValue) {
          finalSegment = transformParam(paramName, paramValue);
          // Keep the actual value in the URL
          href = currentPath.replace(segment, paramValue);
        }
      }

      // Get custom label if available
      const label =
        labels[segment] ||
        finalSegment
          // Convert to title case and replace hyphens/underscores
          .replace(/[-_]/g, " ")
          .replace(/^\w|\s\w/g, (c) => c.toUpperCase())
          // Remove brackets for dynamic segments
          .replace(/\[|\]/g, "");

      breadcrumbs.push({
        label,
        href,
        isCurrent: index === segments.length - 1,
      });
    });

    return breadcrumbs;
  }, [pathname, params, labels, exclude, transformParam]);
};

export default useBreadcrumb;

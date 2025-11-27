"use client";

import React from "react";
import Link from "next/link";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CreateNoteButton from "./create-note-button";

interface BreadcrumbNavProps {
  /**
   * Custom labels for specific routes
   */
  labels?: Record<string, string>;

  /**
   * Routes to exclude from the breadcrumb
   */
  exclude?: string[];

  /**
   * Class name to apply to the breadcrumb container
   */
  className?: string;
}

export function BreadcrumbNav({
  labels = {},
  exclude = ["(dashboard)"],
  className,
}: BreadcrumbNavProps) {
  const defaultTransformParam = (param: string, value: string) => {
    if (param === "id") {
      return `Item ${value}`;
    }
    return value;
  };

  const breadcrumbs = useBreadcrumb({
    labels,
    exclude,
    transformParam: defaultTransformParam,
  });

  if (breadcrumbs.length <= 1) {
    return (
      <>
        <CreateNoteButton />
      </>
    );
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbItem>
              {crumb.isCurrent ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbNav;

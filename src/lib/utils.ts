import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeSlug(name_string: string) {
  let slug = name_string.trim();
  slug = slug.toLowerCase();
  slug = slug.replace(/\s+/g, "_");
  slug = slug.replace(/[^\w_]/g, ""); // Remove non-alphanumeric characters except underscores
  return slug;
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Dynamically update meta keywords based on page content
 * This is a client component that can analyze page content
 */
export function KeywordsMeta({ keywords }: { keywords: string[] }) {
  const pathname = usePathname();

  useEffect(() => {
    // Update meta keywords tag
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", keywords.join(", "));
  }, [keywords, pathname]);

  return null;
}

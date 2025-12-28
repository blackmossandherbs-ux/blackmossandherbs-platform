import { Metadata } from "next";

export interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  price?: {
    amount: number;
    currency: string;
  };
}

export function generateSEO(config: SEOConfig): Metadata {
  const {
    title,
    description,
    image,
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    tags,
    price,
  } = config;

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blackmossandherbs.com";
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/og-image.jpg`;

  const metadata: Metadata = {
    title: `${title} | BlackMoss & Herbs`,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "BlackMoss & Herbs",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      locale: "en_US",
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: fullUrl,
    },
    ...(price && {
      other: {
        "product:price:amount": price.amount.toString(),
        "product:price:currency": price.currency,
      },
    }),
  };

  return metadata;
}

export function generateStructuredData(config: {
  type: "Product" | "Article" | "Organization" | "WebSite";
  data: Record<string, any>;
}) {
  const { type, data } = config;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blackmossandherbs.com";

  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  // Add organization for all types
  if (type !== "Organization") {
    baseStructuredData.publisher = {
      "@type": "Organization",
      name: "BlackMoss & Herbs",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    };
  }

  return baseStructuredData;
}

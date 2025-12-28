import { Metadata } from "next";

/**
 * Advanced SEO utilities with Schema.org structured data
 */

export interface AdvancedSEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url: string;
  type?: "website" | "article" | "product" | "video" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: {
    name: string;
    url?: string;
  };
  section?: string;
  tags?: string[];
  price?: {
    amount: number;
    currency: string;
  };
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  rating?: {
    value: number;
    count: number;
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
  organization?: {
    name: string;
    url: string;
    logo: string;
    contactPoint?: {
      telephone: string;
      contactType: string;
      areaServed: string;
    };
  };
}

export function generateAdvancedSEO(config: AdvancedSEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    price,
    availability,
    rating,
    organization,
  } = config;

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blackmossandherbs.com";
  const fullUrl = url.startsWith("http") ? url : `${siteUrl}${url}`;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/og-image.jpg`;

  const defaultKeywords = [
    "herbal wellness",
    "natural health",
    "herbal products",
    "wellness consultation",
    "herbal remedies",
    "natural supplements",
    "holistic health",
    "herbal medicine",
    "wellness platform",
    "herbal consultations",
  ];

  const allKeywords = [...defaultKeywords, ...keywords].slice(0, 10);

  const metadata: Metadata = {
    title: `${title} | BlackMoss & Herbs`,
    description,
    keywords: allKeywords.join(", "),
    authors: author ? [{ name: author.name, url: author.url }] : undefined,
    creator: author?.name,
    publisher: organization?.name || "BlackMoss & Herbs",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl,
    },
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
          type: "image/jpeg",
        },
      ],
      locale: "en_US",
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@blackmossherbs",
      site: "@blackmossherbs",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_SITE_VERIFICATION,
    },
    ...(price && {
      other: {
        "product:price:amount": price.amount.toString(),
        "product:price:currency": price.currency,
        ...(availability && { "product:availability": availability }),
      },
    }),
    ...(rating && {
      other: {
        "rating:value": rating.value.toString(),
        "rating:count": rating.count.toString(),
      },
    }),
  };

  return metadata;
}

export function generateStructuredDataAdvanced(config: AdvancedSEOConfig) {
  const {
    title,
    description,
    image,
    url,
    type,
    publishedTime,
    modifiedTime,
    author,
    price,
    availability,
    rating,
    breadcrumbs,
    organization,
  } = config;

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blackmossandherbs.com";
  const fullUrl = url.startsWith("http") ? url : `${siteUrl}${url}`;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/og-image.jpg`;

  const defaultOrg = {
    "@type": "Organization",
    name: organization?.name || "BlackMoss & Herbs",
    url: organization?.url || siteUrl,
    logo: {
      "@type": "ImageObject",
      url: organization?.logo || `${siteUrl}/logo.png`,
    },
    sameAs: [
      "https://www.facebook.com/blackmossherbs",
      "https://www.instagram.com/blackmossherbs",
      "https://twitter.com/blackmossherbs",
    ],
    contactPoint: organization?.contactPoint
      ? {
          "@type": "ContactPoint",
          telephone: organization.contactPoint.telephone,
          contactType: organization.contactPoint.contactType,
          areaServed: organization.contactPoint.areaServed,
        }
      : undefined,
  };

  const baseData: any = {
    "@context": "https://schema.org",
    "@graph": [
      defaultOrg,
      {
        "@type": "WebSite",
        name: "BlackMoss & Herbs",
        url: siteUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  // Add main entity based on type
  let mainEntity: any = {
    "@type": type === "product" ? "Product" : type === "article" ? "Article" : "WebPage",
    headline: title,
    description,
    url: fullUrl,
    image: ogImage,
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
    ...(author && {
      author: {
        "@type": "Person",
        name: author.name,
        ...(author.url && { url: author.url }),
      },
    }),
    publisher: defaultOrg,
  };

  if (type === "product" && price) {
    mainEntity.offers = {
      "@type": "Offer",
      price: price.amount.toString(),
      priceCurrency: price.currency,
      availability: `https://schema.org/${availability || "InStock"}`,
      url: fullUrl,
    };
    if (rating) {
      mainEntity.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: rating.value.toString(),
        reviewCount: rating.count.toString(),
      };
    }
  }

  if (type === "article") {
    mainEntity.articleSection = config.section;
    if (config.tags) {
      mainEntity.keywords = config.tags.join(", ");
    }
  }

  baseData["@graph"].push(mainEntity);

  // Add breadcrumbs
  if (breadcrumbs && breadcrumbs.length > 0) {
    baseData["@graph"].push({
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url.startsWith("http") ? crumb.url : `${siteUrl}${crumb.url}`,
      })),
    });
  }

  return baseData;
}

export function generateBreadcrumbsSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${process.env.NEXT_PUBLIC_APP_URL || "https://blackmossandherbs.com"}${item.url}`,
    })),
  };
}

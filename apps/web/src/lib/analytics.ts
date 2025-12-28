/**
 * Analytics utilities
 * Supports Google Analytics, Plausible, and custom analytics
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
  }
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  if (typeof window === "undefined") return;

  // Google Analytics 4
  if (window.gtag) {
    window.gtag("event", eventName, properties);
  }

  // Plausible
  if (window.plausible) {
    window.plausible(eventName, { props: properties });
  }

  // Custom analytics endpoint
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true") {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: eventName, properties }),
    }).catch(console.error);
  }
}

export function trackPageView(url: string) {
  if (typeof window === "undefined") return;

  // Google Analytics
  if (window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID || "", {
      page_path: url,
    });
  }

  // Plausible
  if (window.plausible) {
    window.plausible("pageview");
  }
}

export function trackPurchase(data: {
  transactionId: string;
  value: number;
  currency: string;
  items: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>;
}) {
  trackEvent("purchase", {
    transaction_id: data.transactionId,
    value: data.value,
    currency: data.currency,
    items: data.items,
  });
}

export function trackAddToCart(data: {
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
}) {
  trackEvent("add_to_cart", {
    item_id: data.itemId,
    item_name: data.itemName,
    price: data.price,
    quantity: data.quantity,
  });
}

export function trackSearch(query: string) {
  trackEvent("search", { search_term: query });
}

export function trackConsultationBooking(data: {
  practitionerId: string;
  price: number;
}) {
  trackEvent("consultation_booking", {
    practitioner_id: data.practitionerId,
    price: data.price,
  });
}

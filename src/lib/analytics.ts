const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

let isInitialized = false;

function isAnalyticsEnabled() {
  return Boolean(MEASUREMENT_ID);
}

export function initAnalytics() {
  if (!isAnalyticsEnabled() || isInitialized || typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, {
    send_page_view: false,
  });

  isInitialized = true;
}

export function trackPageView(path: string) {
  if (!isAnalyticsEnabled() || typeof window === "undefined") {
    return;
  }

  initAnalytics();
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!isAnalyticsEnabled() || typeof window === "undefined") {
    return;
  }

  initAnalytics();
  window.gtag?.("event", name, params);
}

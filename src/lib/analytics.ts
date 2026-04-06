const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function isAnalyticsEnabled() {
  return Boolean(MEASUREMENT_ID);
}

export function getAnalyticsMeasurementId() {
  return MEASUREMENT_ID;
}

export function trackPageView(path: string) {
  if (!isAnalyticsEnabled() || typeof window === "undefined") {
    return;
  }

  window.gtag?.("config", MEASUREMENT_ID, {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    send_page_view: true,
  });
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!isAnalyticsEnabled() || typeof window === "undefined") {
    return;
  }

  window.gtag?.("event", name, params);
}

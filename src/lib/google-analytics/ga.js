export const pageView = (url) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", process.env.GOOGLE_ANALYTICS_ID, {
      page_path: url,
    });
  }
};

// log specific events happening.
export const event = ({ action, params }) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, params);
  }
};

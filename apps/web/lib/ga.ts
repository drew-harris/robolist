export const GA_TRACKING_ID = "G-DR295YT7SS";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL): void => {
	if (window) {
		window.gtag("config", GA_TRACKING_ID, {
			page_path: url,
		});
	}
};

type GTagEventDetails = {
	category?: string;
	label?: string;
	value?: string | number;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const logEvent = (
	action: string,
	{ category, label, value }: GTagEventDetails = {}
): void => {
	if (window) {
		window.gtag("event", action, {
			event_category: category,
			event_label: label,
			value,
		});
	}
};

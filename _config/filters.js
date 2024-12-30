import { DateTime } from "luxon";

function formatSaudiDate(dateObj, format) {
	const options = format || { day: '2-digit', month: 'long', year: 'numeric' };
	const formatter = new Intl.DateTimeFormat('ar-SA', { ...options, timeZone: 'Asia/Riyadh' });
	const arabicFormattedDate = formatter.format(dateObj);

	// Replace Indian numerals (٠١٢٣٤٥٦٧٨٩) with Arabic numerals (0123456789)
	const westernFormattedDate = arabicFormattedDate.replace(
		/[\u0660-\u0669]/g,
		digit => String.fromCharCode(digit.charCodeAt(0) - 0x0660 + 48)
	);

	return westernFormattedDate;
}

export default function (eleventyConfig) {
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return formatSaudiDate(dateObj);
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if (!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if (n < 0) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return the keys used in an object
	eleventyConfig.addFilter("getKeys", target => {
		return Object.keys(target);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "posts"].indexOf(tag) === -1);
	});

};

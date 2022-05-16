/**
 * Public path to store downloaded images.
 */
export const AN_IMAGES_DIR = "public/images/astronotion";

export type Image = { id: string; url: string };

/**
 * Given a full URL, get the image path. Optionally prepend with
 * string from preceding path to ensure unique file name.
 *
 * @param {string} url
 * @param {boolean=} prepend
 * @returns {string} eg. "cat-in-helmet.jpg"
 */
export const getFilename = (url: string, prepend = false) => {
	const urlObj = new URL(url);
	if (!prepend) {
		return urlObj.pathname.split("/").pop() || "INVALID_PATH";
	}
	const split = urlObj.pathname.split("/");
	const [name, pre] = [split.pop(), split.pop()];
	return `${pre}_${name}`;
};

/**
 * Returns true if URL contains an expires header, which means it
 * needs to be downloaded to user's directory.
 *
 * @param {string} url
 * @returns {boolean}
 */
export const checkShouldDownloadImage = (url: string) => {
	return url.includes("X-Amz-Expires");
};

/**
 * Returns true if URL should be replaced with a downloadable one,
 * ie. with an expires header.
 *
 * @param {string} url
 * @returns {boolean}
 */
export const checkShouldReplaceDownloadable = (url: string) => {
	return url.includes("secure.notion-static.com");
};

/**
 * Run customization on Notion image URLs, eg. add missing base path,
 * add size params, etc.
 *
 * @param {string} url
 * @returns {string}
 */
export const customizeImageUrl = (url: string) => {
	if (url.startsWith("/images/page-cover/")) {
		return `https://www.notion.so${url}`;
	} else if (url.includes("images.unsplash.com")) {
		return `${url}&w=2000`;
	}
	return url;
};

/**
 * Compare a given image URL with list of downloadable URLs.
 * Return a matching downloadable URL (ie. if it's a custom uploaded image)
 * or else return the original URL (ie. from Notion gallery, Unsplash, etc).
 *
 * @param {string} oriUrl
 * @param {string[]} downloadableUrls
 * @returns string
 */
export const replaceImageUrlWithDownloadable = (oriUrl: string, downloadableUrls: string[]) => {
	const match = downloadableUrls.find(
		(url) => getFilename(url, true) === getFilename(oriUrl, true)
	);
	return match || oriUrl;
};

/**
 * Wrapper function for other image helper functions in this module.
 *
 * @param {string} oriUrl
 * @param {string[]=} downloadableUrls
 * @returns string
 */
export const transformImageUrl = (oriUrl: string, downloadableUrls: string[] = []) => {
	return checkShouldReplaceDownloadable(oriUrl) && downloadableUrls.length
		? replaceImageUrlWithDownloadable(oriUrl, downloadableUrls)
		: customizeImageUrl(oriUrl);
};

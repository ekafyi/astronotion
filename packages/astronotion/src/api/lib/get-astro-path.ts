import type { ExtendedRecordMap } from "notion-types";
import { flattenBlocks } from "./flatten";
import { transformTopLevelPage, transformEntryPage } from "./transform-page";
import type { AnParentPage, AnEntryPage } from "./transform-page";

type AnAstroStaticPathBase = {
	params: { fullSlug: string };
};

export type AnTopLevelAstroStaticPath = AnAstroStaticPathBase & {
	props: AnParentPage | AnEntryPage;
};

export type AnChildAstroStaticPath = AnAstroStaticPathBase & {
	props: AnEntryPage;
};

export type AnConfigPage = {
	notionId: string;
	path: string;
};

/**
 * Helper function to return a user-defined base path, and optionally
 * prepend it to the page id, to be used as URL paths,
 * eg. "posts" (parent page) or "posts/{:uuid}" (entry page).
 *
 * @param {ExtendedRecordMap} data
 * @param {AnConfigPage[]} configs
 * @param {boolean=} isTopLevel
 * @returns {string=}
 */
const getUserDefinedPath = (
	data: ExtendedRecordMap,
	configs: AnConfigPage[] = [],
	isTopLevel = false
) => {
	const blocks = flattenBlocks(data.block);
	const pageId = blocks[0].id;
	const parentPageId = blocks[1].id;

	const matchId = isTopLevel ? pageId : parentPageId;
	const match = configs.find(
		(item) => item.notionId.replace(/-/g, "") === matchId.replace(/-/g, "")
	);
	if (!match) return;

	const basePath = match.path.startsWith("/") ? match.path.substring(1) : match.path; // Ensure no leading slash
	return isTopLevel ? basePath : `${basePath}${basePath.length ? "/" : ""}${pageId}`;
};

/**
 * Transform notion-client API data to Astro's getStaticPaths object
 * for user-specified top-level pages. These pages can be either a
 * "parent" (collection) page or a standalone entry page.
 *
 * ⚠️ Keep transform/customisation implementations in the transformBlah
 * helper functions, not here.
 *
 * @link https://docs.astro.build/en/reference/api-reference/#getstaticpaths
 */
export const getTopLevelAstroStaticPathData = (
	data: ExtendedRecordMap,
	configs: AnConfigPage[] = []
): AnTopLevelAstroStaticPath | undefined => {
	const props = transformTopLevelPage(data);
	const basePath = getUserDefinedPath(data, configs, true);

	if (!props || !basePath) return;

	return { params: { fullSlug: basePath }, props };
};

/**
 * Transform notion-client API data to Astro's getStaticPaths object
 * for "child" pages, ie. pages inside a top-level collection/DB page.
 *
 * ⚠️ Keep transform/customisation implementations in the transformBlah
 * helper functions, not here.
 *
 * @link https://docs.astro.build/en/reference/api-reference/#getstaticpaths
 */
export const getChildAstroStaticPathData = (
	data: ExtendedRecordMap,
	configs: AnConfigPage[] = []
): AnChildAstroStaticPath | undefined => {
	const props = transformEntryPage(data);
	const twoSegmentPath = getUserDefinedPath(data, configs, false);

	if (!props || !twoSegmentPath) return;

	return { params: { fullSlug: twoSegmentPath }, props };
};

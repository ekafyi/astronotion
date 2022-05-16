import type { ExtendedRecordMap } from "notion-types";
import { flattenBlocks } from "./flatten";

/**
 * Check if a given Notion page data is a collection/database (ie. "parent") type,
 * which contains a list of entry pages.
 *
 * @param {ExtendedRecordMap} data
 * @returns {boolean} true if page type is "collection_view_page"
 */
export const checkIfParentPage = (data: ExtendedRecordMap) => {
	const blocks = flattenBlocks(data.block);
	return !!blocks.length && blocks[0].type === "collection_view_page";
};

import type { BlockMap, Decoration } from "notion-types";

/**
 * Get plain text from a notion-client "Block" data, which consists
 * of nested arrays with formatting metadata.
 *
 * @param {Decoration[]} data
 * @returns {string} text content
 */
export const flattenText = (data: Decoration[]) =>
	data
		.map((item) => item[0])
		.flat()
		.join(" ")
		.replace(/\s\s+/g, " ");

export const flattenBlocks = (blockMap: BlockMap) =>
	Object.entries(blockMap).map((item) => item[1].value);

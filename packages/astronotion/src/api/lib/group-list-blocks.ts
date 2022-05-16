/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
	NumberedListBlock,
	BulletedListBlock,
	TodoBlock,
	ColumnListBlock,
	ColumnBlock,
} from "notion-types";
import type { AnContentBlock } from "./filter-blocks";
import { isOfType } from "./type-utils";

export type AnGroupableBlocks = (
	| BulletedListBlock
	| NumberedListBlock
	| TodoBlock
	| ColumnListBlock
	| ColumnBlock
)[];
// export type AnGroupableBlocks = BulletedListBlock[] | NumberedListBlock[] | TodoBlock[]	| (ColumnListBlock | ColumnBlock)[];

export type AnGroupBlock = {
	type?: typeof GROUPABLE_TYPES[number];
	items: AnGroupableBlocks;
};

type TemporarySortedList = {
	level: number;
	items: AnGroupableBlocks;
};

export const GROUPABLE_TYPES = [
	"bulleted_list",
	"numbered_list",
	"to_do",
	"column_list",
	"column",
] as const;

/**
 * Helper function to compare two "groupable" block types to decide
 * if they should be grouped together.
 * Nonstandard case: "column_list" and "column" blocks are grouped together.
 *
 * @param {string} typeOne
 * @param {string} typeTwo
 * @returns {boolean}
 */
const checkSameGroup = (typeOne: string, typeTwo: string) => {
	if (typeOne.startsWith("column") && typeTwo.startsWith("column")) {
		return (typeOne === "column_list" && typeTwo === "column") || typeOne === typeTwo;
	}
	return typeOne === typeTwo;
};

/**
 * Given an array of content blocks, return a new array with specific block types
 * (list, column) grouped in a container object.
 *
 * @param {AnContentBlock[]} data
 * @returns {(AnContentBlock | AnGroupBlock)[]}
 */
export const groupListBlocks = (data: AnContentBlock[]): (AnContentBlock | AnGroupBlock)[] => {
	const newBlocks: (AnContentBlock | AnGroupBlock)[] = [];

	// Initiate temporary variable to store groupable blocks.
	let tempGroup: AnGroupBlock = { items: [] as AnGroupBlock["items"] }; // ?? for some reason tempGroup.items is considered never[] only when running push on it?

	data.forEach((block, i) => {
		// Check if current block should/not be grouped.
		if (GROUPABLE_TYPES.includes(block.type as typeof GROUPABLE_TYPES[number])) {
			// If current block should be grouped...

			// Make a new variable with the appropriate type to keep TS happy.
			const listBlock = block as AnGroupBlock["items"][number];

			// Check if temporary group object is already populated.
			if (tempGroup.items.length && tempGroup.type) {
				// If not empty, check if current group content is of same type as current block.
				if (checkSameGroup(tempGroup.type, listBlock.type)) {
					// If same type, add current block to group.
					// @ts-ignore
					tempGroup.items.push(listBlock as AnGroupBlock["items"][number]);
				} else {
					// If different type, push current group content to blocks data
					// and replace temporary group object with the current block.
					newBlocks.push(tempGroup);
					tempGroup.type = listBlock.type as AnGroupBlock["type"];
					// @ts-ignore
					tempGroup.items.push(listBlock as AnGroupBlock["items"][number]);
				}
			} else {
				// If empty, populate the temporary group object.
				tempGroup.type = listBlock.type as AnGroupBlock["type"];
				// @ts-ignore
				tempGroup.items.push(listBlock as AnGroupBlock["items"][number]);
			}

			// TODO (later) custom handle column data

			// If at last item in loop and it is a groupable item, push it.
			if (i === data.length - 1) {
				newBlocks.push(tempGroup);
			}
		} else {
			// If current block should not be grouped...

			// Check if temporary group object is populated.
			if (tempGroup.items.length) {
				// If populated, push its content to blocks data and reset the object.
				newBlocks.push(tempGroup);
				tempGroup = { items: [] };
				// If empty, do nothing.
			}

			// Push regular block data to blocks array.
			newBlocks.push(block);
		}
	});
	return newBlocks;
};

/**
 * Convert an array of "list" blocks to a new array based on nested levels.
 * Top-level list item (= level 0) may have child list items (= level 1), etc.
 *
 * @param data
 * @returns
 */
export const sortNestedList = (data: AnGroupBlock["items"]) => {
	const sorted: TemporarySortedList[] = [];

	let sortedIds: string[] = [];

	data.forEach((block: AnGroupBlock["items"][number], i: number) => {
		if (i === 0) {
			sortedIds.push(block.id);
			sorted.push({
				level: 0,
				items: [block],
			});

			// if it has children, they will be level 1
			if (block.content?.length) {
				const blockChildren = data.filter((item) => block.content?.includes(item.id));
				sortedIds = sortedIds.concat(blockChildren.map((item) => item.id));
				sorted.push({
					level: 1,
					items: blockChildren,
				});
			}
		} else {
			// second item onwards
			// only process if not already pushed
			if (!sortedIds.includes(block.id)) {
				sortedIds.push(block.id);

				// get level based on parent_id
				let parentLevel;
				let matchingParent;

				const findMatchingParent = (sortedLevel: TemporarySortedList) => {
					parentLevel = sortedLevel.level;
					matchingParent = sortedLevel.items.find((item) => item.id === block.parent_id);
					return !matchingParent;
				};
				sorted.every(findMatchingParent);
				const hasMatchingParent = !!matchingParent;

				if (hasMatchingParent) {
					// check if that level exists
					if (sorted[(parentLevel ?? 0) + 1]) {
						sorted[(parentLevel ?? 0) + 1].items.push(block);
					} else {
						sorted.push({
							level: ((parentLevel ?? 0) + 1) as number,
							items: [block],
						});
					}
				} else {
					// if no parent then push at level 0
					sorted[0].items.push(block);
				}

				// if it has children, add them
				if (block.content?.length) {
					const blockChildren = data.filter((item) => block.content?.includes(item.parent_id));
					sortedIds = sortedIds.concat(blockChildren.map((item) => item.id));
					// check if that level exists
					const level = hasMatchingParent && parentLevel ? parentLevel + 2 : 1;
					if (sorted[level]) {
						sorted[level].items = sorted[level].items.concat(blockChildren);
					} else {
						sorted.push({
							level: level,
							items: blockChildren,
						});
					}
				}
			}
		}
	});
	return sorted;
};

/**
 * Helper function to get data of a given list item's "children" ids.
 *
 * @param {string[]} childIds
 * @param {AnGroupBlock["items"]} blocks
 * @returns
 */
export const getListChildrenData = (
	childIds: string[],
	blocks: AnGroupBlock["items"] = []
): AnGroupBlock["items"] => {
	return childIds.map((id) => blocks.find((block) => block.id === id)).filter(isOfType);
};

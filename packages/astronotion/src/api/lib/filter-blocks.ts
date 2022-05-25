import type {
	Block,
	BlockMap,
	PageBlock,
	// Supported content blocks
	TextBlock,
	NumberedListBlock,
	BulletedListBlock,
	HeaderBlock,
	SubHeaderBlock,
	SubSubHeaderBlock,
	TodoBlock,
	DividerBlock,
	ColumnListBlock,
	ColumnBlock,
	QuoteBlock,
	CodeBlock,
	ImageBlock,
	VideoBlock,
	BookmarkBlock,
	CalloutBlock,
} from "notion-types";
import { flattenBlocks } from "./flatten";

/**
 * Block types supported by astronotion UI components.
 */
export type AnContentBlock =
	| TextBlock
	| BulletedListBlock
	| NumberedListBlock
	| HeaderBlock
	| SubHeaderBlock
	| SubSubHeaderBlock
	| TodoBlock
	| DividerBlock
	| ColumnListBlock
	| ColumnBlock
	| QuoteBlock
	| CodeBlock
	| ImageBlock
	| VideoBlock
	| BookmarkBlock
	| CalloutBlock;

const CONTENT_BLOCK_TYPES = [
	"text",
	"bulleted_list",
	"numbered_list",
	"header",
	"sub_header",
	"sub_sub_header",
	"to_do",
	"divider",
	"column_list",
	"column",
	"quote",
	"code",
	"image",
	"video",
	"bookmark",
	"callout",
];

export const filterContentBlocks = (data: Block[]) =>
	data.filter((item): item is AnContentBlock => CONTENT_BLOCK_TYPES.includes(item.type));

export const filterChildBlocks = (data: BlockMap, parentUuid: string) => {
	return flattenBlocks(data).filter(
		(item): item is PageBlock => item.type === "page" && !item.content?.includes(parentUuid)
	);
};

import type { Collection, PageBlock } from "notion-types";
import type { MakeRequired } from "./type-utils";

export type FormatWithCover = Collection["format"] & { collection_cover_position?: number };

export type ParentWithCover = Partial<Collection> & { cover?: string; format?: FormatWithCover };

export type EntryWithCover = MakeRequired<Partial<PageBlock>, "format">;

export type AnCoverImage = {
	url: string;
	position?: number;
};

/**
 * Get a consistent cover image object between "parent" (collection) page and "child" page.
 *
 * @param {ParentWithCover | EntryWithCover} data
 * @returns {AnCoverImage=}
 */
export const getCover = (
	data: ParentWithCover | EntryWithCover
	// downloadables: Image[] = []
): AnCoverImage | undefined => {
	if ("cover" in data && !!data.cover) {
		const position = data.format?.collection_cover_position ?? undefined;
		return {
			url: data.cover,
			position,
		};
	} else if ("type" in data && data.type === "page" && !!data.format.page_cover) {
		const position = data.format.page_cover_position ?? undefined;
		return {
			url: data.format.page_cover,
			position,
		};
	}
	return;
};

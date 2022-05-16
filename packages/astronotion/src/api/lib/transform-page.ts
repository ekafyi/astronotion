import type { Collection, Decoration, ExtendedRecordMap, PageBlock } from "notion-types";
import { checkIfParentPage } from "./check-page-type";
import { filterContentBlocks } from "./filter-blocks";
import type { AnContentBlock } from "./filter-blocks";
import { flattenBlocks, flattenText } from "./flatten";
import { getCover } from "./get-cover";
import { transformImageUrl } from "./image-file";

type AnPageBase = {
	title: string;
	icon?: string;
	cover?: ReturnType<typeof getCover>;
	description?: Decoration[];
};

export type AnExcerpt = AnPageBase & {
	id: string;
	taxonomies: string[]; // !! update when implementing the feature
	created: number;
	updated: number;
};

export type AnParentPage = {
	pageType: "NOTION_PARENT";
	pageData: AnPageBase & {
		childPages: AnExcerpt[];
	};
};

export type AnEntryPage = {
	pageType: "NOTION_ENTRY";
	pageData: AnExcerpt & {
		contents: AnContentBlock[];
	};
};

export type AnTopLevelPage = AnParentPage | AnEntryPage;

type CollectionWithCoverAndDesc = Collection & {
	cover?: string;
	description?: Decoration[];
};

/**
 * Get and transform the "signed_urls" field from page data returned
 * by notion-client. These will be compared against image URLs to
 * determine whether they should be downloaded before they expire.
 *
 * @param {ExtendedRecordMap} data
 * @returns {Image}
 */
const getDownloadableUrlsFromPage = (data: ExtendedRecordMap) => {
	if (!data.signed_urls) return [];
	return Object.entries(data.signed_urls).map((item) => item[1]);
};

const transformChildPageBlock = (data: PageBlock, downloadableUrls?: string[]) => {
	const { id, properties, format, created_time, last_edited_time } = data;
	const title = flattenText(properties?.title || []);
	const icon = format.page_icon;

	const cover = getCover(data);
	if (cover && cover.url) {
		cover.url = transformImageUrl(cover.url, downloadableUrls);
	}

	// TODO (later) taxonomies & custom created/updated
	const taxonomies: string[] = [];
	const created = created_time;
	const updated = last_edited_time;

	return {
		id,
		title,
		icon,
		cover,
		description: undefined as Decoration[] | undefined, // !! temporary workaround
		taxonomies,
		created,
		updated,
	};
};

const transformContentBlock = (
	data: ReturnType<typeof filterContentBlocks>[number],
	downloadableUrls?: string[]
) => {
	if (data.type !== "image") return data; // Do nothing for non-image blocks.

	const imageUrl = data.properties.source[0][0];
	if (imageUrl) {
		data.properties.source[0][0] = transformImageUrl(imageUrl, downloadableUrls);
	}
	return data;
};

export const transformParentPage = (data: ExtendedRecordMap): AnParentPage | undefined => {
	const coll = Object.entries(data.collection)[0][1].value as CollectionWithCoverAndDesc;

	const downloadableUrls = getDownloadableUrlsFromPage(data);

	const { name, description, icon } = coll;
	const title = flattenText(name);

	const cover = getCover(coll);
	if (cover && cover.url) {
		cover.url = transformImageUrl(cover.url, downloadableUrls);
	}

	const childPages = flattenBlocks(data.block)
		.filter((item) => item.type === "page")
		.map((item) => transformChildPageBlock(item as PageBlock, downloadableUrls));

	return {
		pageType: "NOTION_PARENT",
		pageData: {
			title,
			icon,
			cover,
			description,
			childPages,
		},
	};
};

export const transformEntryPage = (data: ExtendedRecordMap): AnEntryPage | undefined => {
	const blocks = flattenBlocks(data.block);
	const pageBlock = blocks[0];
	if (pageBlock.type !== "page" || !pageBlock.properties || blocks.length < 3) return;

	const downloadableUrls = getDownloadableUrlsFromPage(data);

	const { id, properties, format, created_time, last_edited_time } = pageBlock;
	const title = flattenText(properties.title);
	const icon = format.page_icon;

	const cover = getCover(pageBlock);
	if (cover && cover.url) {
		cover.url = transformImageUrl(cover.url, downloadableUrls);
	}

	const contents = filterContentBlocks(blocks).map((item) =>
		transformContentBlock(item, downloadableUrls)
	);

	// TODO (later) taxonomies, custom created/updated, description
	const taxonomies: string[] = [];
	const created = created_time;
	const updated = last_edited_time;
	let description;

	return {
		pageType: "NOTION_ENTRY",
		pageData: {
			id,
			title,
			icon,
			cover,
			description,
			contents,
			taxonomies,
			created,
			updated,
		},
	};
};

export const transformTopLevelPage = (data: ExtendedRecordMap) => {
	const isParent = checkIfParentPage(data);
	return isParent ? transformParentPage(data) : transformEntryPage(data);
};

// ?? differentiate _top-level vs child_ entry page if needed

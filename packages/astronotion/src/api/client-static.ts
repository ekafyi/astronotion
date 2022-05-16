import { NotionAPI } from "notion-client";
import {
	getChildAstroStaticPathData,
	getTopLevelAstroStaticPathData,
	isFulfilled,
	isOfType,
	transformTopLevelPage,
} from "./lib";
import type {
	AnChildAstroStaticPath,
	AnConfigPage,
	AnEntryPage,
	AnParentPage,
	AnTopLevelAstroStaticPath,
} from "./lib";

export const getPage = async (
	notionId: string,
	type: "parent" | "standalone"
): Promise<undefined | AnParentPage | AnEntryPage> => {
	const notionApi = new NotionAPI();

	const page = await notionApi.getPage(notionId);
	const transformedPage = transformTopLevelPage(page);

	if (!transformedPage) {
		console.warn(
			`Page ${notionId} is not found. Make sure it exists and has a "public" view setting.`
		);
		return;
	}
	if (type === "parent" && transformedPage.pageType === "NOTION_PARENT") {
		return transformedPage;
	} else if (type === "standalone" && transformedPage.pageType === "NOTION_ENTRY") {
		return transformedPage;
	} else {
		console.warn(`Page ${notionId} is not compatible with the type of ${type}.`);
		return;
	}
};

export const getParentPage = async (notionId: string) => {
	const data = (await getPage(notionId, "parent")) as AnParentPage | undefined;
	return data?.pageData || undefined;
};

export const getStandalonePage = async (notionId: string) => {
	const data = (await getPage(notionId, "standalone")) as AnEntryPage | undefined;
	return data?.pageData || undefined;
};

export const getChildPagesStaticPaths = async (args: {
	parentId: string;
	childPages: AnParentPage["pageData"]["childPages"];
	basePath?: string;
}) => {
	const { parentId, childPages = [], basePath = "" } = args;

	const notionApi = new NotionAPI();

	const childIds = childPages.map((item) => item.id);
	const childPaths = (
		await Promise.allSettled(childIds.map((childId) => notionApi.getPage(childId)))
	)
		.filter(isFulfilled)
		.map((item) => item.value)
		.map((item) => getChildAstroStaticPathData(item, [{ notionId: parentId, path: basePath }]))
		.filter(isOfType);

	return childPaths;
};

export const getManyBaseStaticPaths = async (
	pageConfigs: AnConfigPage[] = []
): Promise<(AnTopLevelAstroStaticPath | AnChildAstroStaticPath)[]> => {
	const notionApi = new NotionAPI();

	const ids = pageConfigs.map((item) => item.notionId);
	const topLevelPaths = (await Promise.allSettled(ids.map((id) => notionApi.getPage(id))))
		.filter(isFulfilled)
		.map((item) => item.value)
		.map((item) => getTopLevelAstroStaticPathData(item, pageConfigs))
		.filter(isOfType);

	const parents = topLevelPaths
		.map((item) => item.props)
		.filter((item): item is AnParentPage => item.pageType === "NOTION_PARENT")
		.map((item) => item.pageData);

	const childIds = parents.map((parent) => parent.childPages.map((item) => item.id)).flat();
	const childPaths = (
		await Promise.allSettled(childIds.map((childId) => notionApi.getPage(childId)))
	)
		.filter(isFulfilled)
		.map((item) => item.value)
		.map((item) => getChildAstroStaticPathData(item, pageConfigs))
		.filter(isOfType);

	const allPaths: (AnTopLevelAstroStaticPath | AnChildAstroStaticPath)[] =
		topLevelPaths.concat(childPaths);
	return allPaths;
};

export const getOneBaseStaticPaths = async (pageConfig: AnConfigPage) => {
	const notionApi = new NotionAPI();

	const page = await notionApi.getPage(pageConfig.notionId);
	const topLevelPath = getTopLevelAstroStaticPathData(page, [pageConfig]);
	if (!topLevelPath) {
		console.warn(
			`Page ${pageConfig.notionId} is not found. Make sure it exists and has a "public" view setting.`
		);
		return;
	}

	if (topLevelPath.props.pageType === "NOTION_ENTRY") return [topLevelPath];

	const childIds = topLevelPath.props.pageData.childPages.map((item) => item.id);
	const childPaths = (
		await Promise.allSettled(childIds.map((childId) => notionApi.getPage(childId)))
	)
		.filter(isFulfilled)
		.map((item) => item.value)
		.map((item) => getChildAstroStaticPathData(item, [pageConfig]))
		.filter(isOfType);

	return [topLevelPath, ...childPaths];
};

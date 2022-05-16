import config from "../../../../fixtures/an-config.json";
import sourceTwo from "../../../../fixtures/notion-client-entry-page-1.json";
import sourceOne from "../../../../fixtures/notion-client-parent-page-1.json";

import { getTopLevelAstroStaticPathData, getChildAstroStaticPathData } from "../get-astro-path";

const configPages = config.pages;

describe("get Astro getStaticPath data for top-level page", () => {
	test("top-level parent page", () => {
		// @ts-expect-error using static JSON data source
		expect(getTopLevelAstroStaticPathData(sourceOne, configPages)).toMatchSnapshot();
	});

	test("top-level entry page", () => {
		// @ts-expect-error using static JSON data source
		expect(getTopLevelAstroStaticPathData(sourceTwo, configPages)).toMatchSnapshot();
	});
});

describe("get Astro getStaticPath data for child page", () => {
	test("child page", () => {
		// @ts-expect-error using static JSON data source
		expect(getChildAstroStaticPathData(sourceTwo, configPages)).toMatchSnapshot();
	});
});

import sourceTwo from "../../../../fixtures/notion-client-entry-page-1.json";
import sourceOne from "../../../../fixtures/notion-client-parent-page-1.json";

import { transformTopLevelPage } from "../transform-page";

describe("transform top-level page with the correct type", () => {
	test("top-level parent page", () => {
		// @ts-expect-error using static JSON data source
		expect(transformTopLevelPage(sourceOne)).toMatchSnapshot();
	});

	test("top-level entry page", () => {
		// @ts-expect-error using static JSON data source
		expect(transformTopLevelPage(sourceTwo)).toMatchSnapshot();
	});
});

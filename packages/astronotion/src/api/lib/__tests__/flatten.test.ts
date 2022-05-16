import sourceTwo from "../../../../fixtures/notion-client-entry-page-1.json";
import sourceOne from "../../../../fixtures/notion-client-parent-page-1.json";

import { flattenText, flattenBlocks } from "../flatten";

const decoratedTextOne = [["Journal"]];
const decoratedTextTwo = [
	["Click "],
	["All Entries", [["c"]]],
	[" to filter entries by a specific category such as "],
	["daily", [["b"]]],
	[" or "],
	["personal", [["b"]]],
	["."],
];

const blocksOne = [
	sourceOne.block["2ba80ec3-d84d-4647-9f23-ec15ba5e39b0"],
	sourceOne.block["0588e349-5e26-40f0-b791-54618c4f285b"],
];
const blocksTwo = [
	sourceTwo.block["0588e349-5e26-40f0-b791-54618c4f285b"],
	sourceTwo.block["14c6292d-f91f-4302-9854-7932dbd419a9"],
];

describe("flatten text", () => {
	test("flatten simple text", () => {
		// @ts-expect-error using static JSON data source
		expect(flattenText(decoratedTextOne)).toMatchInlineSnapshot(`"Journal"`);
	});
	test("flatten formatted text", () => {
		// @ts-expect-error using static JSON data source
		expect(flattenText(decoratedTextTwo)).toMatchInlineSnapshot(
			`"Click All Entries to filter entries by a specific category such as daily or personal ."`
		);
	});
});

describe("convert blocks to array", () => {
	test("from parent page", () => {
		// @ts-expect-error using static JSON data source
		expect(flattenBlocks(blocksOne)).toMatchSnapshot();
	});
	test("from entry/child page", () => {
		// @ts-expect-error using static JSON data source
		expect(flattenBlocks(blocksTwo)).toMatchSnapshot();
	});
});

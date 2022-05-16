import { filterContentBlocks } from "../filter-blocks";

const sampleBlock1 = {
	id: "302cee25-3cf0-4036-a518-b28185472582",
	type: "text",
};
const sampleBlock2 = {
	id: "2ba80ec3-d84d-4647-9f23-ec15ba5e39b0",
	type: "collection_view_page",
};
const sampleBlocks = [sampleBlock1, sampleBlock2];

test("filter content blocks", () => {
	// @ts-expect-error using hardcoded minimal data source
	expect(filterContentBlocks(sampleBlocks)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "id": "302cee25-3cf0-4036-a518-b28185472582",
		    "type": "text",
		  },
		]
	`);
});

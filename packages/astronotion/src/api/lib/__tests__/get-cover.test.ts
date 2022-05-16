import sourceTwo from "../../../../fixtures/notion-client-entry-page-1.json";
import sourceOne from "../../../../fixtures/notion-client-parent-page-1.json";

import { getCover } from "../get-cover";

const parentPageData = sourceOne.collection["fa3d5bda-3e25-46e4-b86c-3157329bad83"].value;
const entryPageData = sourceTwo.block["1cf6f82e-ffc2-4ad4-aea5-a50f88198a7b"].value;

describe("get cover", () => {
	test("get cover in parent page", () => {
		expect(getCover(parentPageData)).toMatchInlineSnapshot(`
		Object {
		  "position": 0.5071,
		  "url": "https://images.unsplash.com/photo-1637689113621-73951984fcc1?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb",
		}
	`);
	});

	test("get cover in entry/child page", () => {
		// @ts-expect-error using static JSON data source
		expect(getCover(entryPageData)).toMatchInlineSnapshot(`
		Object {
		  "position": 0.2353,
		  "url": "https://s3-us-west-2.amazonaws.com/secure.notion-static.com/be4b2294-2834-4cef-a8db-414c477a9218/igor-son-FV_PxCqgtwc-unsplash.jpg",
		}
	`);
	});
});

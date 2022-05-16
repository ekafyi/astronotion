import sourceTwo from "../../../../fixtures/notion-client-entry-page-1.json";
import sourceOne from "../../../../fixtures/notion-client-parent-page-1.json";

import { checkIfParentPage } from "../check-page-type";

test("check if parent page", () => {
	// @ts-expect-error using static JSON data source
	expect(checkIfParentPage(sourceOne)).toMatchInlineSnapshot(`true`);
	// @ts-expect-error using static JSON data source
	expect(checkIfParentPage(sourceTwo)).toMatchInlineSnapshot(`false`);
});

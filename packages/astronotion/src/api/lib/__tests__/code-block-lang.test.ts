import { getCodeLangText, convertCodeLangNotionToShiki } from "../code-block-lang";

const sampleDataJs = [["JavaScript"]];
const sampleDataCss = [["CSS"]];
const sampleDataTxt = [["Plain Text"]];

test("get code language text", () => {
	// @ts-expect-error using hardcoded data source
	expect(getCodeLangText(sampleDataJs)).toMatchInlineSnapshot(`"JavaScript"`);
});

test("convert code language to valid Astro Code/shiki value", () => {
	// @ts-expect-error using hardcoded data source
	expect(convertCodeLangNotionToShiki(getCodeLangText(sampleDataJs))).toMatchInlineSnapshot(
		`"javascript"`
	);
	// @ts-expect-error using hardcoded data source
	expect(convertCodeLangNotionToShiki(getCodeLangText(sampleDataCss))).toMatchInlineSnapshot(
		`"css"`
	);
	// @ts-expect-error using hardcoded data source
	expect(convertCodeLangNotionToShiki(getCodeLangText(sampleDataTxt))).toMatchInlineSnapshot(
		`undefined`
	);
});

import { getFilename, replaceImageUrlWithDownloadable } from "../image-file";

const sampleUrlOne =
	"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/be4b2294-2834-4cef-a8db-414c477a9218/igor-son-FV_PxCqgtwc-unsplash.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220507T163103Z&X-Amz-Expires=86400&X-Amz-Signature=b17e119b9761a424b273afaa6c336ee168f8309c5ba6921e229cd1c44c7f130b&X-Amz-SignedHeaders=host&x-id=GetObject";

const sampleUrlTwo =
	"https://web-dev.imgix.net/image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/aX6PmKj8pQudiWgt4x31.png";

describe("get file name from image url", () => {
	test("default", () => {
		expect(getFilename(sampleUrlOne)).toMatchInlineSnapshot(`"igor-son-FV_PxCqgtwc-unsplash.jpg"`);
		expect(getFilename(sampleUrlTwo)).toMatchInlineSnapshot(`"aX6PmKj8pQudiWgt4x31.png"`);
	});

	test("prepend uuid from path", () => {
		expect(getFilename(sampleUrlOne, true)).toMatchInlineSnapshot(
			`"be4b2294-2834-4cef-a8db-414c477a9218_igor-son-FV_PxCqgtwc-unsplash.jpg"`
		);
		expect(getFilename(sampleUrlTwo, true)).toMatchInlineSnapshot(
			`"KT4TDYaWOHYfN59zz6Rc0X4k4MH3_aX6PmKj8pQudiWgt4x31.png"`
		);
	});
});

const sampleDownloadableUrl =
	"https://s3-us-west-2.amazonaws.com/secure.notion-static.com/be4b2294-2834-4cef-a8db-414c477a9218/igor-son-FV_PxCqgtwc-unsplash.jpg";

const sampleExternalUrl =
	"https://images.unsplash.com/photo-1520520731457-9283dd14aa66?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb";

const sampleSignedUrls = [
	"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/be4b2294-2834-4cef-a8db-414c477a9218/igor-son-FV_PxCqgtwc-unsplash.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220507T163103Z&X-Amz-Expires=86400&X-Amz-Signature=b17e119b9761a424b273afaa6c336ee168f8309c5ba6921e229cd1c44c7f130b&X-Amz-SignedHeaders=host&x-id=GetObject",
	"https://domain.com/obvious-dummy-string-for-test.jpg",
];

describe("replace image url with downloadable url if applicable", () => {
	test("replace custom image url", () => {
		expect(
			replaceImageUrlWithDownloadable(sampleDownloadableUrl, sampleSignedUrls)
		).toMatchInlineSnapshot(
			`"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/be4b2294-2834-4cef-a8db-414c477a9218/igor-son-FV_PxCqgtwc-unsplash.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220507T163103Z&X-Amz-Expires=86400&X-Amz-Signature=b17e119b9761a424b273afaa6c336ee168f8309c5ba6921e229cd1c44c7f130b&X-Amz-SignedHeaders=host&x-id=GetObject"`
		);
	});

	test("return original url", () => {
		expect(replaceImageUrlWithDownloadable(sampleDownloadableUrl, [])).toMatchInlineSnapshot(
			`"https://s3-us-west-2.amazonaws.com/secure.notion-static.com/be4b2294-2834-4cef-a8db-414c477a9218/igor-son-FV_PxCqgtwc-unsplash.jpg"`
		);

		expect(
			replaceImageUrlWithDownloadable(sampleExternalUrl, sampleSignedUrls)
		).toMatchInlineSnapshot(
			`"https://images.unsplash.com/photo-1520520731457-9283dd14aa66?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb"`
		);
	});
});

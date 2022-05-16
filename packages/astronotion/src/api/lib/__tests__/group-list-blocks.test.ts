import { sortNestedList, getListChildrenData } from "../group-list-blocks";

const sampleListBlocks = [
	{
		id: "ea7ff374-1338-48d7-8a16-2dfe6b03a57a",
		properties: {
			title: [["dessert"]],
		},
		content: [
			"db6aa217-bb81-4013-b058-d4658725c9ef",
			"54ad2e87-a953-4892-9f6a-d6541686fdec",
			"1b34f483-3a00-4c6e-91f4-d3415a9c9730",
		],
		parent_id: "1cf6f82e-ffc2-4ad4-aea5-a50f88198a7b",
	},
	{
		id: "db6aa217-bb81-4013-b058-d4658725c9ef",
		properties: {
			title: [["cake"]],
		},
		parent_id: "ea7ff374-1338-48d7-8a16-2dfe6b03a57a",
	},
	{
		id: "54ad2e87-a953-4892-9f6a-d6541686fdec",
		properties: {
			title: [["pie"]],
		},
		content: ["39aa0802-cef7-431e-98a0-0a024d6adb53", "198c0bb0-d2b8-42bb-9d62-85a04d2ab818"],
		parent_id: "ea7ff374-1338-48d7-8a16-2dfe6b03a57a",
	},
	{
		id: "39aa0802-cef7-431e-98a0-0a024d6adb53",
		properties: {
			title: [["apple pie"]],
		},
		parent_id: "54ad2e87-a953-4892-9f6a-d6541686fdec",
	},
	{
		id: "198c0bb0-d2b8-42bb-9d62-85a04d2ab818",
		properties: {
			title: [["blueberry pie"]],
		},
		parent_id: "54ad2e87-a953-4892-9f6a-d6541686fdec",
	},
	{
		id: "1b34f483-3a00-4c6e-91f4-d3415a9c9730",
		properties: {
			title: [["pastry"]],
		},
		parent_id: "ea7ff374-1338-48d7-8a16-2dfe6b03a57a",
	},
	{
		id: "a682d78f-d898-4a21-9738-ae21b16a1d33",
		properties: {
			title: [["appetizer"]],
		},
		content: [
			"def985e1-1ff2-4de9-b876-dacdbe3fed46",
			"bda69ae0-e1de-4765-a8b9-c6f41a88f382",
			"b14260ce-f072-49cb-92cc-11bcb6c7519e",
		],
		parent_id: "1cf6f82e-ffc2-4ad4-aea5-a50f88198a7b",
	},
	{
		id: "def985e1-1ff2-4de9-b876-dacdbe3fed46",
		properties: {
			title: [["garlic bread"]],
		},
		parent_id: "a682d78f-d898-4a21-9738-ae21b16a1d33",
	},
	{
		id: "bda69ae0-e1de-4765-a8b9-c6f41a88f382",
		properties: {
			title: [["onion rings"]],
		},
		parent_id: "a682d78f-d898-4a21-9738-ae21b16a1d33",
	},
	{
		id: "b14260ce-f072-49cb-92cc-11bcb6c7519e",
		properties: {
			title: [["chip & dip"]],
		},
		parent_id: "a682d78f-d898-4a21-9738-ae21b16a1d33",
	},
];

test("get child list data", () => {
	// @ts-expect-error using static JSON data source
	expect(getListChildrenData(sampleListBlocks[0].content, sampleListBlocks)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "id": "db6aa217-bb81-4013-b058-d4658725c9ef",
		    "parent_id": "ea7ff374-1338-48d7-8a16-2dfe6b03a57a",
		    "properties": Object {
		      "title": Array [
		        Array [
		          "cake",
		        ],
		      ],
		    },
		  },
		  Object {
		    "content": Array [
		      "39aa0802-cef7-431e-98a0-0a024d6adb53",
		      "198c0bb0-d2b8-42bb-9d62-85a04d2ab818",
		    ],
		    "id": "54ad2e87-a953-4892-9f6a-d6541686fdec",
		    "parent_id": "ea7ff374-1338-48d7-8a16-2dfe6b03a57a",
		    "properties": Object {
		      "title": Array [
		        Array [
		          "pie",
		        ],
		      ],
		    },
		  },
		  Object {
		    "id": "1b34f483-3a00-4c6e-91f4-d3415a9c9730",
		    "parent_id": "ea7ff374-1338-48d7-8a16-2dfe6b03a57a",
		    "properties": Object {
		      "title": Array [
		        Array [
		          "pastry",
		        ],
		      ],
		    },
		  },
		]
	`);
});

test("transform list items", () => {
	// @ts-expect-error using static JSON data source
	expect(sortNestedList(sampleListBlocks)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "items": Array [
		      Object {
		        "content": Array [
		          "db6aa217-bb81-4013-b058-d4658725c9ef",
		          "54ad2e87-a953-4892-9f6a-d6541686fdec",
		          "1b34f483-3a00-4c6e-91f4-d3415a9c9730",
		        ],
		        "id": "ea7ff374-1338-48d7-8a16-2dfe6b03a57a",
		        "parent_id": "1cf6f82e-ffc2-4ad4-aea5-a50f88198a7b",
		        "properties": Object {
		          "title": Array [
		            Array [
		              "dessert",
		            ],
		          ],
		        },
		      },
		      Object {
		        "content": Array [
		          "def985e1-1ff2-4de9-b876-dacdbe3fed46",
		          "bda69ae0-e1de-4765-a8b9-c6f41a88f382",
		          "b14260ce-f072-49cb-92cc-11bcb6c7519e",
		        ],
		        "id": "a682d78f-d898-4a21-9738-ae21b16a1d33",
		        "parent_id": "1cf6f82e-ffc2-4ad4-aea5-a50f88198a7b",
		        "properties": Object {
		          "title": Array [
		            Array [
		              "appetizer",
		            ],
		          ],
		        },
		      },
		      Object {
		        "id": "def985e1-1ff2-4de9-b876-dacdbe3fed46",
		        "parent_id": "a682d78f-d898-4a21-9738-ae21b16a1d33",
		        "properties": Object {
		          "title": Array [
		            Array [
		              "garlic bread",
		            ],
		          ],
		        },
		      },
		      Object {
		        "id": "bda69ae0-e1de-4765-a8b9-c6f41a88f382",
		        "parent_id": "a682d78f-d898-4a21-9738-ae21b16a1d33",
		        "properties": Object {
		          "title": Array [
		            Array [
		              "onion rings",
		            ],
		          ],
		        },
		      },
		      Object {
		        "id": "b14260ce-f072-49cb-92cc-11bcb6c7519e",
		        "parent_id": "a682d78f-d898-4a21-9738-ae21b16a1d33",
		        "properties": Object {
		          "title": Array [
		            Array [
		              "chip & dip",
		            ],
		          ],
		        },
		      },
		    ],
		    "level": 0,
		  },
		  Object {
		    "items": Array [
		      Object {
		        "id": "db6aa217-bb81-4013-b058-d4658725c9ef",
		        "parent_id": "ea7ff374-1338-48d7-8a16-2dfe6b03a57a",
		        "properties": Object {
		          "title": Array [
		            Array [
		              "cake",
		            ],
		          ],
		        },
		      },
		      Object {
		        "content": Array [
		          "39aa0802-cef7-431e-98a0-0a024d6adb53",
		          "198c0bb0-d2b8-42bb-9d62-85a04d2ab818",
		        ],
		        "id": "54ad2e87-a953-4892-9f6a-d6541686fdec",
		        "parent_id": "ea7ff374-1338-48d7-8a16-2dfe6b03a57a",
		        "properties": Object {
		          "title": Array [
		            Array [
		              "pie",
		            ],
		          ],
		        },
		      },
		      Object {
		        "id": "1b34f483-3a00-4c6e-91f4-d3415a9c9730",
		        "parent_id": "ea7ff374-1338-48d7-8a16-2dfe6b03a57a",
		        "properties": Object {
		          "title": Array [
		            Array [
		              "pastry",
		            ],
		          ],
		        },
		      },
		    ],
		    "level": 1,
		  },
		  Object {
		    "items": Array [
		      Object {
		        "id": "39aa0802-cef7-431e-98a0-0a024d6adb53",
		        "parent_id": "54ad2e87-a953-4892-9f6a-d6541686fdec",
		        "properties": Object {
		          "title": Array [
		            Array [
		              "apple pie",
		            ],
		          ],
		        },
		      },
		      Object {
		        "id": "198c0bb0-d2b8-42bb-9d62-85a04d2ab818",
		        "parent_id": "54ad2e87-a953-4892-9f6a-d6541686fdec",
		        "properties": Object {
		          "title": Array [
		            Array [
		              "blueberry pie",
		            ],
		          ],
		        },
		      },
		    ],
		    "level": 2,
		  },
		]
	`);
});

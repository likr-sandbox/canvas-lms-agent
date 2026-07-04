const test = require("node:test");
const assert = require("node:assert");
const modules = require("../tools/modules");

test("list_modules tool requests course modules and formats items when requested", async () => {
  let calledUrl = null;
  let calledParams = null;

  const mockClient = {
    get: async (url, config) => {
      calledUrl = url;
      calledParams = config?.params;
      return {
        data: [
          {
            id: 119537,
            name: "Week 1",
            position: 1,
            items_count: 2,
            items: [
              { id: 411573, title: "Syllabus", type: "Page", external_url: null },
              { id: 411574, title: "Google", type: "ExternalUrl", external_url: "https://google.com" },
            ],
          },
        ],
      };
    },
  };

  const result = await modules.handlers.list_modules(mockClient, { course_id: 101, include_items: true });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/modules");
  assert.deepStrictEqual(calledParams, { "include[]": ["items"] });
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    id: 119537,
    name: "Week 1",
    position: 1,
    items_count: 2,
    items: [
      { id: 411573, title: "Syllabus", type: "Page", external_url: null },
      { id: 411574, title: "Google", type: "ExternalUrl", external_url: "https://google.com" },
    ],
  });
});

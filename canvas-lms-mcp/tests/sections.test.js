const test = require("node:test");
const assert = require("node:assert");
const sections = require("../tools/sections");

test("list_sections lists course sections", async () => {
  let calledUrl = null;

  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 456, name: "Section A", course_id: 101, sis_section_id: "SIS-A" },
        ],
      };
    },
  };

  const result = await sections.handlers.list_sections(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/sections");
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    id: 456,
    name: "Section A",
    course_id: 101,
    sis_section_id: "SIS-A",
  });
});

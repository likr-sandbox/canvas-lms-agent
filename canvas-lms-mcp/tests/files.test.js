const test = require("node:test");
const assert = require("node:assert");
const files = require("../tools/files");

test("list_files tool searches with correct course ID and parameters", async () => {
  let calledUrl = null;
  let calledParams = null;

  const mockClient = {
    get: async (url, config) => {
      calledUrl = url;
      calledParams = config?.params;
      return {
        data: [
          {
            id: 501,
            folder_id: 22,
            display_name: "lecture1.pdf",
            filename: "lecture1.pdf",
            content_type: "application/pdf",
            url: "https://canvas.example.com/files/501",
            size: 2048,
            created_at: "2026-07-04T00:00:00Z",
          },
        ],
      };
    },
  };

  const result = await files.handlers.list_files(mockClient, { course_id: 101, search_term: "lecture1" });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/files");
  assert.deepStrictEqual(calledParams, { search_term: "lecture1" });
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    id: 501,
    folder_id: 22,
    display_name: "lecture1.pdf",
    filename: "lecture1.pdf",
    content_type: "application/pdf",
    url: "https://canvas.example.com/files/501",
    size: 2048,
    created_at: "2026-07-04T00:00:00Z",
  });
});

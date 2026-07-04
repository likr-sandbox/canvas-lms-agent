const test = require("node:test");
const assert = require("node:assert");
const users = require("../tools/users");

test("list_users lists course users and supports optional search term", async () => {
  let calledUrl = null;
  let calledParams = null;

  const mockClient = {
    get: async (url, config) => {
      calledUrl = url;
      calledParams = config?.params;
      return {
        data: [
          { id: 32362, name: "Yosuke Onoue", sortable_name: "Onoue, Yosuke", short_name: "Yosuke", created_at: "2026-04-01T00:00:00Z" },
        ],
      };
    },
  };

  const result = await users.handlers.list_users(mockClient, { course_id: 101, search_term: "Yosuke" });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/users");
  assert.deepStrictEqual(calledParams, { search_term: "Yosuke" });
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    id: 32362,
    name: "Yosuke Onoue",
    sortable_name: "Onoue, Yosuke",
    short_name: "Yosuke",
    created_at: "2026-04-01T00:00:00Z",
  });
});

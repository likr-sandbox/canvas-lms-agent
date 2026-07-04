const test = require("node:test");
const assert = require("node:assert");
const discussions = require("../tools/discussions");

test("list_discussion_topics lists all discussion topics", async () => {
  let calledUrl = null;

  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 401, title: "Topic 1", message: "Hello", posted_at: "2026-06-01T00:00:00Z", user_name: "Yosuke", last_reply_at: "2026-06-02T00:00:00Z", discussion_type: "side_comment" },
        ],
      };
    },
  };

  const result = await discussions.handlers.list_discussion_topics(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/discussion_topics");
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    id: 401,
    title: "Topic 1",
    message: "Hello",
    posted_at: "2026-06-01T00:00:00Z",
    user_name: "Yosuke",
    last_reply_at: "2026-06-02T00:00:00Z",
    discussion_type: "side_comment",
  });
});

test("list_announcements lists announcements by querying with only_announcements=true", async () => {
  let calledUrl = null;
  let calledParams = null;

  const mockClient = {
    get: async (url, config) => {
      calledUrl = url;
      calledParams = config?.params;
      return {
        data: [
          { id: 402, title: "Notice 1", message: "Important", posted_at: "2026-06-01T00:00:00Z", user_name: "Yosuke", last_reply_at: "2026-06-02T00:00:00Z", locked: true, pinned: false },
        ],
      };
    },
  };

  const result = await discussions.handlers.list_announcements(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/discussion_topics");
  assert.deepStrictEqual(calledParams, { only_announcements: true });
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    id: 402,
    title: "Notice 1",
    message: "Important",
    posted_at: "2026-06-01T00:00:00Z",
    user_name: "Yosuke",
    last_reply_at: "2026-06-02T00:00:00Z",
    locked: true,
    pinned: false,
  });
});

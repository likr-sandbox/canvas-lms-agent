const test = require("node:test");
const assert = require("node:assert");
const courses = require("../tools/courses");

test("get_current_user tool calls the correct endpoint and returns formatted user", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: {
          id: 12345,
          name: "Test User",
          short_name: "Test",
          email: "test@example.com",
          login_id: "test_login",
          time_zone: "UTC",
        },
      };
    },
  };

  const result = await courses.handlers.get_current_user(mockClient);
  assert.strictEqual(calledUrl, "/api/v1/users/self");
  assert.deepStrictEqual(result, {
    id: 12345,
    name: "Test User",
    short_name: "Test",
    primary_email: "test@example.com",
    login_id: "test_login",
    time_zone: "UTC",
  });
});

test("list_courses tool calls correct endpoint and filters active courses", async () => {
  let calledUrl = null;
  let calledParams = null;
  const mockClient = {
    get: async (url, config) => {
      calledUrl = url;
      calledParams = config?.params;
      return {
        data: [
          { id: 101, name: "Course A", course_code: "CA", start_at: "2026-04-01T00:00:00Z" },
          { id: 102, course_code: "CB", start_at: null },
        ],
      };
    },
  };

  const result = await courses.handlers.list_courses(mockClient);
  assert.strictEqual(calledUrl, "/api/v1/courses");
  assert.deepStrictEqual(calledParams, { enrollment_state: "active" });
  assert.strictEqual(result.length, 2);
  assert.deepStrictEqual(result[0], {
    id: 101,
    name: "Course A",
    course_code: "CA",
    start_at: "2026-04-01T00:00:00Z",
  });
});

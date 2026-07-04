const test = require("node:test");
const assert = require("node:assert");
const assignments = require("../tools/assignments");

test("list_assignments tool calls correct course endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 201, name: "Homework 1", points_possible: 100, due_at: "2026-05-01T23:59:59Z", has_submitted_submissions: true },
        ],
      };
    },
  };

  const result = await assignments.handlers.list_assignments(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/assignments");
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    id: 201,
    name: "Homework 1",
    points_possible: 100,
    due_at: "2026-05-01T23:59:59Z",
    has_submitted_submissions: true,
  });
});

test("submit_assignment tool calls post with correct payload", async () => {
  let calledUrl = null;
  let calledPayload = null;
  const mockClient = {
    post: async (url, payload) => {
      calledUrl = url;
      calledPayload = payload;
      return {
        data: {
          id: 999,
          assignment_id: 201,
          user_id: 54477,
          submission_type: "online_text_entry",
          submitted_at: "2026-07-04T12:00:00Z",
          url: null,
        },
      };
    },
  };

  const args = {
    course_id: 101,
    assignment_id: 201,
    submission_type: "online_text_entry",
    body: "Done with homework!",
    text_comment: "Please review.",
  };

  const result = await assignments.handlers.submit_assignment(mockClient, args);
  assert.strictEqual(calledUrl, "/api/v1/courses/101/assignments/201/submissions");
  assert.deepStrictEqual(calledPayload, {
    submission: {
      submission_type: "online_text_entry",
      body: "Done with homework!",
    },
    comment: {
      text_comment: "Please review.",
    },
  });
  assert.deepStrictEqual(result, {
    id: 999,
    assignment_id: 201,
    user_id: 54477,
    submission_type: "online_text_entry",
    submitted_at: "2026-07-04T12:00:00Z",
    url: null,
  });
});

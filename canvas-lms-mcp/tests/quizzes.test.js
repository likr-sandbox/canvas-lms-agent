const test = require("node:test");
const assert = require("node:assert");
const quizzes = require("../tools/quizzes");

test("list_quizzes lists all course quizzes", async () => {
  let calledUrl = null;

  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 701, title: "Quiz 1", points_possible: 20, question_count: 5, time_limit: 30, due_at: "2026-07-04T12:00:00Z", published: true },
        ],
      };
    },
  };

  const result = await quizzes.handlers.list_quizzes(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/quizzes");
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    id: 701,
    title: "Quiz 1",
    points_possible: 20,
    question_count: 5,
    time_limit: 30,
    due_at: "2026-07-04T12:00:00Z",
    published: true,
  });
});

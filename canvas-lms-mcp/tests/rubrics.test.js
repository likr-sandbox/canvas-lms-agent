const test = require("node:test");
const assert = require("node:assert");
const rubrics = require("../tools/rubrics");

test("list_rubrics lists course rubrics", async () => {
  let calledUrl = null;

  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          {
            id: 11,
            title: "Project Rubric",
            context_id: 101,
            context_type: "Course",
            points_possible: 50,
            reusable: true,
            public: false,
            read_only: false,
          },
        ],
      };
    },
  };

  const result = await rubrics.handlers.list_rubrics(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/rubrics");
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    id: 11,
    title: "Project Rubric",
    context_id: 101,
    context_type: "Course",
    points_possible: 50,
    reusable: true,
    public: false,
    read_only: false,
  });
});

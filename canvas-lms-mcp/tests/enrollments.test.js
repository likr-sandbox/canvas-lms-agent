const test = require("node:test");
const assert = require("node:assert");
const enrollments = require("../tools/enrollments");

test("list_enrollments lists course enrollments and filters by type", async () => {
  let calledUrl = null;
  let calledParams = null;

  const mockClient = {
    get: async (url, config) => {
      calledUrl = url;
      calledParams = config?.params;
      return {
        data: [
          {
            id: 888,
            user_id: 32362,
            course_id: 101,
            type: "StudentEnrollment",
            role: "StudentEnrollment",
            role_id: 3,
            enrollment_state: "active",
            user: { id: 32362, name: "Yosuke Onoue", short_name: "Yosuke" },
          },
        ],
      };
    },
  };

  const result = await enrollments.handlers.list_enrollments(mockClient, { course_id: 101, type: "StudentEnrollment" });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/enrollments");
  assert.deepStrictEqual(calledParams, { "type[]": ["StudentEnrollment"] });
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    id: 888,
    user_id: 32362,
    course_id: 101,
    type: "StudentEnrollment",
    role: "StudentEnrollment",
    role_id: 3,
    enrollment_state: "active",
    user: { id: 32362, name: "Yosuke Onoue", short_name: "Yosuke" },
  });
});

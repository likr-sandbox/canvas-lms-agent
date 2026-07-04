const test = require("node:test");
const assert = require("node:assert");
const submissions = require("../tools/submissions");

test("get_user_grades (as teacher) queries with student_ids[]=all and returns user_id in output", async () => {
  let calledCourseUrl = null;
  let calledSubmissionsUrl = null;
  let calledParams = null;

  const mockClient = {
    get: async (url, config) => {
      if (url.includes("/students/submissions")) {
        calledSubmissionsUrl = url;
        calledParams = config?.params;
        return {
          data: [
            {
              assignment_id: 301,
              user_id: 54477,
              score: 85,
              grade: "85",
              submitted_at: "2026-06-01T00:00:00Z",
              graded_at: "2026-06-02T00:00:00Z",
              excused: false,
              assignment: { name: "Exam 1", points_possible: 100 },
            },
          ],
        };
      } else {
        calledCourseUrl = url;
        return {
          data: {
            id: 101,
            enrollments: [{ type: "teacher" }],
          },
        };
      }
    },
  };

  const result = await submissions.handlers.get_user_grades(mockClient, { course_id: 101 });
  assert.strictEqual(calledCourseUrl, "/api/v1/courses/101");
  assert.strictEqual(calledSubmissionsUrl, "/api/v1/courses/101/students/submissions");
  assert.deepStrictEqual(calledParams, {
    "include[]": ["assignment"],
    "student_ids[]": ["all"],
  });
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    assignment_id: 301,
    user_id: 54477,
    assignment_name: "Exam 1",
    points_possible: 100,
    score: 85,
    grade: "85",
    submitted_at: "2026-06-01T00:00:00Z",
    graded_at: "2026-06-02T00:00:00Z",
    excused: false,
  });
});

test("grade_or_comment_submission updates grade and comment", async () => {
  let calledUrl = null;
  let calledPayload = null;

  const mockClient = {
    put: async (url, payload) => {
      calledUrl = url;
      calledPayload = payload;
      return {
        data: {
          assignment_id: 301,
          user_id: 54477,
          grade: "A-",
          score: 93,
          graded_at: "2026-07-04T12:00:00Z",
        },
      };
    },
  };

  const args = {
    course_id: 101,
    assignment_id: 301,
    user_id: 54477,
    posted_grade: "A-",
    text_comment: "Excellent analysis.",
  };

  const result = await submissions.handlers.grade_or_comment_submission(mockClient, args);
  assert.strictEqual(calledUrl, "/api/v1/courses/101/assignments/301/submissions/54477");
  assert.deepStrictEqual(calledPayload, {
    submission: { posted_grade: "A-" },
    comment: { text_comment: "Excellent analysis." },
  });
  assert.deepStrictEqual(result, {
    assignment_id: 301,
    user_id: 54477,
    grade: "A-",
    score: 93,
    graded_at: "2026-07-04T12:00:00Z",
  });
});

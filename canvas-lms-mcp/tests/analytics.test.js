const test = require("node:test");
const assert = require("node:assert");
const analytics = require("../tools/analytics");

test("get_department_participation_data tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: { by_date: {}, by_category: {} } };
    }
  };

  const result = await analytics.handlers.get_department_participation_data(mockClient, { account_id: 1, term: "current" });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/analytics/current/activity");
  assert.ok(result.by_date);
});

test("get_department_grade_data tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: { grades: [] } };
    }
  };

  const result = await analytics.handlers.get_department_grade_data(mockClient, { account_id: 1, term: "2026" });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/analytics/terms/2026/grades");
  assert.ok(result.grades);
});

test("get_course_participation_data tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: { activity: [] } };
    }
  };

  const result = await analytics.handlers.get_course_participation_data(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/analytics/activity");
  assert.ok(result.activity);
});

test("get_course_grade_data tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: { grades: [] } };
    }
  };

  const result = await analytics.handlers.get_course_grade_data(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/analytics/grades");
  assert.ok(result.grades);
});

test("get_course_student_summaries tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: [] };
    }
  };

  const result = await analytics.handlers.get_course_student_summaries(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/analytics/users");
  assert.ok(Array.isArray(result));
});

test("get_user_participation_data tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: {} };
    }
  };

  const result = await analytics.handlers.get_user_participation_data(mockClient, { course_id: 101, student_id: 202 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/analytics/users/202/activity");
});

test("get_user_assignment_data tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: [] };
    }
  };

  const result = await analytics.handlers.get_user_assignment_data(mockClient, { course_id: 101, student_id: 202 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/analytics/users/202/assignments");
});

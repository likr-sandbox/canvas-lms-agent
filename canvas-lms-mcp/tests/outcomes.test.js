const test = require("node:test");
const assert = require("node:assert");
const outcomes = require("../tools/outcomes");

test("get_outcome calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: { id: 1, title: "Outcome 1", description: "First Outcome", mastery_points: 3, points_possible: 5, ratings: [] },
      };
    },
  };

  const result = await outcomes.handlers.get_outcome(mockClient, { id: 1 });
  assert.strictEqual(calledUrl, "/api/v1/outcomes/1");
  assert.strictEqual(result.title, "Outcome 1");
});

test("update_outcome calls PUT with correct payload", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    put: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return {
        data: { id: 1, title: "Updated Outcome", description: "First Outcome", mastery_points: 4, points_possible: 5 },
      };
    },
  };

  const result = await outcomes.handlers.update_outcome(mockClient, { id: 1, title: "Updated Outcome", mastery_points: 4 });
  assert.strictEqual(calledUrl, "/api/v1/outcomes/1");
  assert.deepStrictEqual(calledData, { title: "Updated Outcome", mastery_points: 4 });
  assert.strictEqual(result.title, "Updated Outcome");
});

test("list_outcome_groups calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 10, title: "Root Group", description: "Course Outcomes Root", subgroups_url: "/api/v1/...", outcomes_url: "/api/v1/..." },
        ],
      };
    },
  };

  const result = await outcomes.handlers.list_outcome_groups(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/outcome_groups");
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].title, "Root Group");
});

test("get_outcome_group calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: { id: 10, title: "Root Group", description: "Course Outcomes Root", subgroups_url: "/api/v1/...", outcomes_url: "/api/v1/..." },
      };
    },
  };

  const result = await outcomes.handlers.get_outcome_group(mockClient, { course_id: 101, id: 10 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/outcome_groups/10");
  assert.strictEqual(result.title, "Root Group");
});

test("list_outcome_results calls correct endpoint with params", async () => {
  let calledUrl = null;
  let calledParams = null;
  const mockClient = {
    get: async (url, config) => {
      calledUrl = url;
      calledParams = config?.params;
      return {
        data: {
          outcome_results: [
            { id: 1, score: 4, percent: 0.8, links: { user: 100, outcome: 1 } },
          ],
        },
      };
    },
  };

  const result = await outcomes.handlers.list_outcome_results(mockClient, { course_id: 101, user_ids: [100], outcome_ids: [1] });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/outcome_results");
  assert.deepStrictEqual(calledParams, { user_ids: [100], outcome_ids: [1] });
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].score, 4);
});

test("list_outcome_rollups calls correct endpoint", async () => {
  let calledUrl = null;
  let calledParams = null;
  const mockClient = {
    get: async (url, config) => {
      calledUrl = url;
      calledParams = config?.params;
      return {
        data: {
          rollups: [
            { links: { user: 100 }, scores: [{ score: 4, count: 1, links: { outcome: 1 } }] },
          ],
        },
      };
    },
  };

  const result = await outcomes.handlers.list_outcome_rollups(mockClient, { course_id: 101, user_ids: [100] });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/outcome_rollups");
  assert.deepStrictEqual(calledParams, { user_ids: [100] });
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0].scores[0], { outcome_id: 1, score: 4, count: 1 });
});

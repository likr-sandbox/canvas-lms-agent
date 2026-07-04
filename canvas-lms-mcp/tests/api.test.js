const test = require("node:test");
const assert = require("node:assert");
const { allHandlers } = require("../tools/index");

test("search_canvas_api returns matching results", async () => {
  const handler = allHandlers.search_canvas_api;
  const result = await handler(null, { query: "courses" });
  assert.ok(result.results.length > 0, "Should return some results");
  assert.ok(result.total_matches > 0, "Total matches should be > 0");
});

test("call_canvas_api formats GET request correctly", async () => {
  const handler = allHandlers.call_canvas_api;
  let calledConfig = null;
  const mockClient = async (config) => {
    calledConfig = config;
    return { data: { success: true } };
  };

  const result = await handler(mockClient, {
    method: "GET",
    path: "/api/v1/courses/1",
    query_params: { include: ["term"] },
  });

  assert.strictEqual(calledConfig.method, "get");
  assert.strictEqual(calledConfig.url, "/api/v1/courses/1");
  assert.deepStrictEqual(calledConfig.params, { include: ["term"] });
  assert.deepStrictEqual(result, { success: true });
});

test("call_canvas_api formats POST request correctly", async () => {
  const handler = allHandlers.call_canvas_api;
  let calledConfig = null;
  const mockClient = async (config) => {
    calledConfig = config;
    return { data: { created: true } };
  };

  const result = await handler(mockClient, {
    method: "POST",
    path: "/api/v1/courses",
    body_params: { course: { name: "New Course" } },
  });

  assert.strictEqual(calledConfig.method, "post");
  assert.strictEqual(calledConfig.url, "/api/v1/courses");
  assert.deepStrictEqual(calledConfig.data, { course: { name: "New Course" } });
  assert.deepStrictEqual(result, { created: true });
});


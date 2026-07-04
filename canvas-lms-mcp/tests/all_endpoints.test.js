const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { allHandlers } = require("../tools/index");

const endpointsPath = path.join(__dirname, "../tools/endpoints.json");
const endpoints = JSON.parse(fs.readFileSync(endpointsPath, "utf-8"));

test("call_canvas_api can execute all generated endpoints", async () => {
  const handler = allHandlers.call_canvas_api;

  for (const ep of endpoints) {
    let calledConfig = null;
    const mockClient = async (config) => {
      calledConfig = config;
      return { data: { success: true } };
    };

    // Construct a simulated path by replacing path parameters
    let testPath = ep.path;
    testPath = testPath.replace(/:([a-zA-Z0-9_]+)/g, "test_$1");
    testPath = testPath.replace(/\{([a-zA-Z0-9_]+)\}/g, "test_$1");
    testPath = testPath.replace(/\*([a-zA-Z0-9_]+)/g, "test_$1");

    const queryParams = {};
    const bodyParams = {};

    // Simulate the LLM providing parameters based on the schema
    for (const [propName, propDef] of Object.entries(ep.parameters)) {
      // Determine dummy value based on type
      let val = "test_val";
      if (propDef.type === "number") val = 123;
      if (propDef.type === "boolean") val = true;
      if (propDef.type === "array") val = ["test_val"];

      // In reality, path parameters shouldn't be in query/body, but since we are just 
      // simulating what an LLM might construct, we'll assign the remaining params.
      // Since it's a generic endpoint caller, we test that whatever is passed to
      // query_params or body_params correctly ends up in the axios config.
      
      const isPathParam = ep.path.includes(`:${propName}`) || 
                          ep.path.includes(`{${propName}}`) || 
                          ep.path.includes(`*${propName}`);
                          
      if (!isPathParam) {
        if (ep.method === "GET" || ep.method === "DELETE") {
          queryParams[propName] = val;
        } else {
          bodyParams[propName] = val;
        }
      }
    }

    const result = await handler(mockClient, {
      method: ep.method,
      path: testPath,
      query_params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
      body_params: Object.keys(bodyParams).length > 0 ? bodyParams : undefined
    });

    assert.strictEqual(calledConfig.method, ep.method.toLowerCase(), `Method mismatch for ${ep.method} ${ep.path}`);
    assert.strictEqual(calledConfig.url, testPath, `Path mismatch for ${ep.method} ${ep.path}`);
    
    if (Object.keys(queryParams).length > 0) {
      assert.deepStrictEqual(calledConfig.params, queryParams, `Query params mismatch for ${ep.method} ${ep.path}`);
    }
    if (Object.keys(bodyParams).length > 0) {
      assert.deepStrictEqual(calledConfig.data, bodyParams, `Body params mismatch for ${ep.method} ${ep.path}`);
    }
    
    assert.deepStrictEqual(result, { success: true }, `Result mismatch for ${ep.method} ${ep.path}`);
  }
});

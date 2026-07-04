const test = require("node:test");
const assert = require("node:assert");
const integrations = require("../tools/integrations");

test("get_sis_import calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: { id: 10, created_at: "2026-07-04T00:00:00Z", workflow_state: "imported", progress: 100, import_type: "instructure_csv" },
      };
    },
  };

  const result = await integrations.handlers.get_sis_import(mockClient, { account_id: 1, id: 10 });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/sis_imports/10");
  assert.strictEqual(result.workflow_state, "imported");
});

test("create_sis_import calls POST with raw CSV content", async () => {
  let calledUrl = null;
  let calledData = null;
  let calledConfig = null;
  const mockClient = {
    post: async (url, data, config) => {
      calledUrl = url;
      calledData = data;
      calledConfig = config;
      return {
        data: { id: 11, workflow_state: "initializing", progress: 0, import_type: "instructure_csv" },
      };
    },
  };

  const result = await integrations.handlers.create_sis_import(mockClient, {
    account_id: 1,
    csv_data: "user_id,login_id,first_name\n100,test1,Test",
  });

  assert.strictEqual(calledUrl, "/api/v1/accounts/1/sis_imports");
  assert.strictEqual(calledData, "user_id,login_id,first_name\n100,test1,Test");
  assert.deepStrictEqual(calledConfig.headers, { "Content-Type": "text/csv" });
  assert.deepStrictEqual(calledConfig.params, { import_type: "instructure_csv", extension: "csv" });
  assert.strictEqual(result.id, 11);
});

test("list_sis_assignments calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 1, course_id: 101, name: "Homework 1", points_possible: 10, post_to_sis: true },
        ],
      };
    },
  };

  const result = await integrations.handlers.list_sis_assignments(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/sis/courses/101/assignments");
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].name, "Homework 1");
});

test("list_external_tools calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 4, name: "LTI Tool", description: "LTI desc", url: "https://lti.example.com", domain: "example.com", consumer_key: "key" },
        ],
      };
    },
  };

  const result = await integrations.handlers.list_external_tools(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/external_tools");
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].name, "LTI Tool");
});

test("get_external_tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: { id: 4, name: "LTI Tool", description: "LTI desc", url: "https://lti.example.com", domain: "example.com", consumer_key: "key" },
      };
    },
  };

  const result = await integrations.handlers.get_external_tool(mockClient, { course_id: 101, id: 4 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/external_tools/4");
  assert.strictEqual(result.name, "LTI Tool");
});

test("create_external_tool calls POST with payload", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return {
        data: { id: 5, name: "New Tool", description: "LTI tool", url: "https://lti.example.com" },
      };
    },
  };

  const result = await integrations.handlers.create_external_tool(mockClient, {
    course_id: 101,
    name: "New Tool",
    consumer_key: "mykey",
    shared_secret: "mysecret",
    config_url: "https://lti.example.com/config",
  });

  assert.strictEqual(calledUrl, "/api/v1/courses/101/external_tools");
  assert.deepStrictEqual(calledData, {
    name: "New Tool",
    consumer_key: "mykey",
    shared_secret: "mysecret",
    config_type: "by_url",
    config_url: "https://lti.example.com/config",
  });
  assert.strictEqual(result.name, "New Tool");
});

test("delete_external_tool calls DELETE", async () => {
  let calledUrl = null;
  const mockClient = {
    delete: async (url) => {
      calledUrl = url;
      return {
        data: { id: 4, name: "LTI Tool", workflow_state: "deleted" },
      };
    },
  };

  const result = await integrations.handlers.delete_external_tool(mockClient, { course_id: 101, id: 4 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/external_tools/4");
  assert.strictEqual(result.workflow_state, "deleted");
});

test("list_lti_registrations calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 20, client_id: "client123", workflow_state: "active", platform_issuer: "issuer", created_at: "2026-07-04T00:00:00Z" },
        ],
      };
    },
  };

  const result = await integrations.handlers.list_lti_registrations(mockClient, { account_id: 1 });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/lti_registrations");
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].client_id, "client123");
});

test("list_custom_gradebook_columns calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 30, title: "Notes", position: 1, hidden: false, teacher_notes: true },
        ],
      };
    },
  };

  const result = await integrations.handlers.list_custom_gradebook_columns(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/custom_gradebook_columns");
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].title, "Notes");
});

test("create_custom_gradebook_column calls POST with payload", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return {
        data: { id: 31, title: "Midterm Notes", position: 2, hidden: true },
      };
    },
  };

  const result = await integrations.handlers.create_custom_gradebook_column(mockClient, {
    course_id: 101,
    title: "Midterm Notes",
    position: 2,
    hidden: true,
  });

  assert.strictEqual(calledUrl, "/api/v1/courses/101/custom_gradebook_columns");
  assert.deepStrictEqual(calledData, {
    column: {
      title: "Midterm Notes",
      position: 2,
      hidden: true,
    },
  });
  assert.strictEqual(result.title, "Midterm Notes");
});

test("update_custom_gradebook_column_data calls PUT with payload", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    put: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return {
        data: { content: "Pass", user_id: 100 },
      };
    },
  };

  const result = await integrations.handlers.update_custom_gradebook_column_data(mockClient, {
    course_id: 101,
    id: 30,
    user_id: 100,
    content: "Pass",
  });

  assert.strictEqual(calledUrl, "/api/v1/courses/101/custom_gradebook_columns/30/data/100");
  assert.deepStrictEqual(calledData, {
    column_data: {
      content: "Pass",
    },
  });
  assert.strictEqual(result.content, "Pass");
});

const test = require("node:test");
const assert = require("node:assert");
const courseAdmin = require("../tools/course_admin");

test("list_blueprint_templates tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: [] };
    }
  };

  const result = await courseAdmin.handlers.list_blueprint_templates(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/blueprint_templates");
  assert.ok(Array.isArray(result));
});

test("list_blueprint_associated_courses tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: [] };
    }
  };

  const result = await courseAdmin.handlers.list_blueprint_associated_courses(mockClient, { course_id: 101, template_id: "default" });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/blueprint_templates/default/associated_courses");
  assert.ok(Array.isArray(result));
});

test("create_blueprint_migration tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 1 } };
    }
  };

  const result = await courseAdmin.handlers.create_blueprint_migration(mockClient, {
    course_id: 101,
    template_id: "default",
    comment: "Test sync",
    copy_settings: true
  });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/blueprint_templates/default/migrations");
  assert.deepStrictEqual(calledData, { comment: "Test sync", send_notification: undefined, copy_settings: true });
  assert.strictEqual(result.id, 1);
});

test("list_blueprint_migrations tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: [] };
    }
  };

  const result = await courseAdmin.handlers.list_blueprint_migrations(mockClient, { course_id: 101, template_id: "default" });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/blueprint_templates/default/migrations");
  assert.ok(Array.isArray(result));
});

test("get_blueprint_migration tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: { id: 2 } };
    }
  };

  const result = await courseAdmin.handlers.get_blueprint_migration(mockClient, { course_id: 101, template_id: "default", id: 2 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/blueprint_templates/default/migrations/2");
  assert.strictEqual(result.id, 2);
});

test("list_course_paces tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: [] };
    }
  };

  const result = await courseAdmin.handlers.list_course_paces(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/course_paces");
  assert.ok(Array.isArray(result));
});

test("create_course_pace tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 5 } };
    }
  };

  const paceConfig = { end_date: "2026-12-31" };
  const result = await courseAdmin.handlers.create_course_pace(mockClient, { course_id: 101, course_pace: paceConfig });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/course_paces");
  assert.deepStrictEqual(calledData, { course_pace: paceConfig });
  assert.strictEqual(result.id, 5);
});

test("get_course_pace tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: { id: 5 } };
    }
  };

  const result = await courseAdmin.handlers.get_course_pace(mockClient, { course_id: 101, id: 5 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/course_paces/5");
  assert.strictEqual(result.id, 5);
});

test("update_course_pace tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    put: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 5 } };
    }
  };

  const paceConfig = { end_date: "2026-12-31" };
  const result = await courseAdmin.handlers.update_course_pace(mockClient, { course_id: 101, id: 5, course_pace: paceConfig });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/course_paces/5");
  assert.deepStrictEqual(calledData, { course_pace: paceConfig });
  assert.strictEqual(result.id, 5);
});

test("delete_course_pace tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    delete: async (url) => {
      calledUrl = url;
      return { data: { status: "deleted" } };
    }
  };

  const result = await courseAdmin.handlers.delete_course_pace(mockClient, { course_id: 101, id: 5 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/course_paces/5");
  assert.strictEqual(result.status, "deleted");
});

test("list_content_migrations tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: [] };
    }
  };

  const result = await courseAdmin.handlers.list_content_migrations(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/content_migrations");
  assert.ok(Array.isArray(result));
});

test("get_content_migration tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: { id: 50, status: "completed" } };
    }
  };

  const result = await courseAdmin.handlers.get_content_migration(mockClient, { course_id: 101, id: 50 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/content_migrations/50");
  assert.strictEqual(result.id, 50);
});

test("create_content_migration tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 50 } };
    }
  };

  const settings = { file_url: "http://example.com" };
  const result = await courseAdmin.handlers.create_content_migration(mockClient, {
    course_id: 101,
    migration_type: "common_cartridge_importer",
    settings
  });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/content_migrations");
  assert.deepStrictEqual(calledData, { migration_type: "common_cartridge_importer", settings });
  assert.strictEqual(result.id, 50);
});

test("update_content_migration tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    put: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 50 } };
    }
  };

  const settings = { file_url: "http://example.com" };
  const result = await courseAdmin.handlers.update_content_migration(mockClient, {
    course_id: 101,
    id: 50,
    settings
  });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/content_migrations/50");
  assert.deepStrictEqual(calledData, { settings });
  assert.strictEqual(result.id, 50);
});

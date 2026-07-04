const test = require("node:test");
const assert = require("node:assert");
const groups = require("../tools/groups");

test("list_groups calls the correct endpoint and returns groups", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 1, name: "Group A", description: "First Group", is_public: false, join_level: "invitation_only", members_count: 5 },
        ],
      };
    },
  };

  const result = await groups.handlers.list_groups(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/groups");
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].name, "Group A");
});

test("get_group calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: { id: 1, name: "Group A", description: "First Group", is_public: false, join_level: "invitation_only", members_count: 5 },
      };
    },
  };

  const result = await groups.handlers.get_group(mockClient, { id: 1 });
  assert.strictEqual(calledUrl, "/api/v1/groups/1");
  assert.strictEqual(result.name, "Group A");
});

test("create_group calls POST with correct payload", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return {
        data: { id: 2, name: "Group B", description: "Second Group", is_public: true, join_level: "parent_context_auto_join" },
      };
    },
  };

  const result = await groups.handlers.create_group(mockClient, {
    course_id: 101,
    name: "Group B",
    description: "Second Group",
    is_public: true,
    join_level: "parent_context_auto_join",
  });

  assert.strictEqual(calledUrl, "/api/v1/courses/101/groups");
  assert.deepStrictEqual(calledData, {
    name: "Group B",
    description: "Second Group",
    is_public: true,
    join_level: "parent_context_auto_join",
  });
  assert.strictEqual(result.name, "Group B");
});

test("delete_group calls DELETE", async () => {
  let calledUrl = null;
  const mockClient = {
    delete: async (url) => {
      calledUrl = url;
      return {
        data: { id: 1, name: "Group A", workflow_state: "deleted" },
      };
    },
  };

  const result = await groups.handlers.delete_group(mockClient, { id: 1 });
  assert.strictEqual(calledUrl, "/api/v1/groups/1");
  assert.strictEqual(result.workflow_state, "deleted");
});

test("list_group_categories calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 10, name: "Project Teams", role: "student", self_signup: "enabled", context_type: "Course" },
        ],
      };
    },
  };

  const result = await groups.handlers.list_group_categories(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/group_categories");
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].name, "Project Teams");
});

test("get_group_category calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: { id: 10, name: "Project Teams", role: "student", self_signup: "enabled", context_type: "Course" },
      };
    },
  };

  const result = await groups.handlers.get_group_category(mockClient, { id: 10 });
  assert.strictEqual(calledUrl, "/api/v1/group_categories/10");
  assert.strictEqual(result.name, "Project Teams");
});

test("create_group_category calls POST with payload", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return {
        data: { id: 11, name: "Lab Teams", role: "student", self_signup: "disabled" },
      };
    },
  };

  const result = await groups.handlers.create_group_category(mockClient, { course_id: 101, name: "Lab Teams" });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/group_categories");
  assert.deepStrictEqual(calledData, { name: "Lab Teams" });
  assert.strictEqual(result.name, "Lab Teams");
});

test("delete_group_category calls DELETE", async () => {
  let calledUrl = null;
  const mockClient = {
    delete: async (url) => {
      calledUrl = url;
      return {
        data: { id: 10, name: "Project Teams" },
      };
    },
  };

  const result = await groups.handlers.delete_group_category(mockClient, { id: 10 });
  assert.strictEqual(calledUrl, "/api/v1/group_categories/10");
  assert.strictEqual(result.name, "Project Teams");
});

test("list_collaborations calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 50, collaboration_type: "google_docs", document_id: "doc123", title: "Project Spec", description: "Spec doc", url: "https://docs.google.com/..." },
        ],
      };
    },
  };

  const result = await groups.handlers.list_collaborations(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/collaborations");
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].title, "Project Spec");
});

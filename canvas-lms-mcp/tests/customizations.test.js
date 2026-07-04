const test = require("node:test");
const assert = require("node:assert");
const customizations = require("../tools/customizations");

test("list_appointment_groups tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledParams = null;
  const mockClient = {
    get: async (url, config) => {
      calledUrl = url;
      calledParams = config?.params;
      return { data: [] };
    }
  };

  const result = await customizations.handlers.list_appointment_groups(mockClient, { scope: "user", context_codes: ["course_1"] });
  assert.strictEqual(calledUrl, "/api/v1/appointment_groups");
  assert.deepStrictEqual(calledParams, { scope: "user", context_codes: ["course_1"] });
  assert.ok(Array.isArray(result));
});

test("create_appointment_group tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 10 } };
    }
  };

  const groupData = { title: "Meeting" };
  const result = await customizations.handlers.create_appointment_group(mockClient, { appointment_group: groupData });
  assert.strictEqual(calledUrl, "/api/v1/appointment_groups");
  assert.deepStrictEqual(calledData, { appointment_group: groupData });
  assert.strictEqual(result.id, 10);
});

test("get_appointment_group tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: { id: 10 } };
    }
  };

  const result = await customizations.handlers.get_appointment_group(mockClient, { id: 10 });
  assert.strictEqual(calledUrl, "/api/v1/appointment_groups/10");
  assert.strictEqual(result.id, 10);
});

test("update_appointment_group tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    put: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 10 } };
    }
  };

  const groupData = { title: "Updated Meeting" };
  const result = await customizations.handlers.update_appointment_group(mockClient, { id: 10, appointment_group: groupData });
  assert.strictEqual(calledUrl, "/api/v1/appointment_groups/10");
  assert.deepStrictEqual(calledData, { appointment_group: groupData });
  assert.strictEqual(result.id, 10);
});

test("delete_appointment_group tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledParams = null;
  const mockClient = {
    delete: async (url, config) => {
      calledUrl = url;
      calledParams = config?.params;
      return { data: { status: "deleted" } };
    }
  };

  const result = await customizations.handlers.delete_appointment_group(mockClient, { id: 10, cancel_reason: "none" });
  assert.strictEqual(calledUrl, "/api/v1/appointment_groups/10");
  assert.deepStrictEqual(calledParams, { cancel_reason: "none" });
  assert.strictEqual(result.status, "deleted");
});

test("list_features tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: [] };
    }
  };

  const result = await customizations.handlers.list_features(mockClient, { context_type: "courses", context_id: "101" });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/features");
  assert.ok(Array.isArray(result));
});

test("get_feature_flag tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: { feature: "new_navigation" } };
    }
  };

  const result = await customizations.handlers.get_feature_flag(mockClient, { context_type: "courses", context_id: "101", feature: "new_navigation" });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/features/flags/new_navigation");
  assert.strictEqual(result.feature, "new_navigation");
});

test("set_feature_flag tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    put: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { state: "on" } };
    }
  };

  const result = await customizations.handlers.set_feature_flag(mockClient, {
    context_type: "courses",
    context_id: "101",
    feature: "new_navigation",
    state: "on"
  });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/features/flags/new_navigation");
  assert.deepStrictEqual(calledData, { state: "on" });
  assert.strictEqual(result.state, "on");
});

test("delete_feature_flag tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    delete: async (url) => {
      calledUrl = url;
      return { data: { status: "deleted" } };
    }
  };

  const result = await customizations.handlers.delete_feature_flag(mockClient, { context_type: "courses", context_id: "101", feature: "new_navigation" });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/features/flags/new_navigation");
  assert.strictEqual(result.status, "deleted");
});

test("list_notification_preferences tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: [] };
    }
  };

  const result = await customizations.handlers.list_notification_preferences(mockClient, { user_id: "self", communication_channel_id: 12 });
  assert.strictEqual(calledUrl, "/api/v1/users/self/communication_channels/12/notification_preferences");
  assert.ok(Array.isArray(result));
});

test("get_notification_preference tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: { category: "announcement" } };
    }
  };

  const result = await customizations.handlers.get_notification_preference(mockClient, { user_id: "self", communication_channel_id: 12, category: "announcement" });
  assert.strictEqual(calledUrl, "/api/v1/users/self/communication_channels/12/notification_preferences/announcement");
  assert.strictEqual(result.category, "announcement");
});

test("update_notification_preference tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    put: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { frequency: "daily" } };
    }
  };

  const result = await customizations.handlers.update_notification_preference(mockClient, {
    communication_channel_id: 12,
    category: "announcement",
    frequency: "daily"
  });
  assert.strictEqual(calledUrl, "/api/v1/users/self/communication_channels/12/notification_preferences/announcement");
  assert.deepStrictEqual(calledData, { notification_preferences: { frequency: "daily" } });
  assert.strictEqual(result.frequency, "daily");
});

test("update_multiple_notification_preferences tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    put: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { status: "success" } };
    }
  };

  const prefs = { announcement: "daily", grading: "immediately" };
  const result = await customizations.handlers.update_multiple_notification_preferences(mockClient, {
    communication_channel_id: 12,
    notification_preferences: prefs
  });
  assert.strictEqual(calledUrl, "/api/v1/users/self/communication_channels/12/notification_preferences");
  assert.deepStrictEqual(calledData, { notification_preferences: prefs });
  assert.strictEqual(result.status, "success");
});

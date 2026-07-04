const test = require("node:test");
const assert = require("node:assert");
const reports = require("../tools/reports");

test("list_account_reports tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: [] };
    }
  };

  const result = await reports.handlers.list_account_reports(mockClient, { account_id: 1 });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/reports");
  assert.ok(Array.isArray(result));
});

test("start_account_report tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 10, status: "running" } };
    }
  };

  const result = await reports.handlers.start_account_report(mockClient, {
    account_id: 1,
    report_type: "sis_export",
    parameters: { include_deleted: true }
  });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/reports/sis_export");
  assert.deepStrictEqual(calledData, { parameters: { include_deleted: true } });
  assert.strictEqual(result.id, 10);
});

test("get_account_report_status tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: { id: 10, status: "complete" } };
    }
  };

  const result = await reports.handlers.get_account_report_status(mockClient, { account_id: 1, report_type: "sis_export", id: 10 });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/reports/sis_export/10");
  assert.strictEqual(result.status, "complete");
});

test("delete_account_report tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    delete: async (url) => {
      calledUrl = url;
      return { data: { status: "deleted" } };
    }
  };

  const result = await reports.handlers.delete_account_report(mockClient, { account_id: 1, report_type: "sis_export", id: 10 });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/reports/sis_export/10");
  assert.strictEqual(result.status, "deleted");
});

test("list_course_reports tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: [] };
    }
  };

  const result = await reports.handlers.list_course_reports(mockClient, { course_id: 101 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/reports");
  assert.ok(Array.isArray(result));
});

test("start_course_report tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 20, status: "running" } };
    }
  };

  const result = await reports.handlers.start_course_report(mockClient, {
    course_id: 101,
    report_type: "grade_export",
    parameters: { include_deleted: false }
  });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/reports/grade_export");
  assert.deepStrictEqual(calledData, { parameters: { include_deleted: false } });
  assert.strictEqual(result.id, 20);
});

test("get_course_report_status tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: { id: 20, status: "complete" } };
    }
  };

  const result = await reports.handlers.get_course_report_status(mockClient, { course_id: 101, report_type: "grade_export", id: 20 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/reports/grade_export/20");
  assert.strictEqual(result.status, "complete");
});

test("delete_course_report tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    delete: async (url) => {
      calledUrl = url;
      return { data: { status: "deleted" } };
    }
  };

  const result = await reports.handlers.delete_course_report(mockClient, { course_id: 101, report_type: "grade_export", id: 20 });
  assert.strictEqual(calledUrl, "/api/v1/courses/101/reports/grade_export/20");
  assert.strictEqual(result.status, "deleted");
});

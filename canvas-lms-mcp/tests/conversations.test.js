const test = require("node:test");
const assert = require("node:assert");
const conversations = require("../tools/conversations");

test("list_conversations calls the correct endpoint and returns conversations", async () => {
  let calledUrl = null;
  let calledParams = null;
  const mockClient = {
    get: async (url, config) => {
      calledUrl = url;
      calledParams = config?.params;
      return {
        data: [
          {
            id: 1,
            subject: "Hello",
            workflow_state: "unread",
            last_message: "Hi there",
            last_message_at: "2026-07-04T00:00:00Z",
            message_count: 1,
            unread: true,
            participants: [{ id: 10, name: "Student A" }],
          },
        ],
      };
    },
  };

  const result = await conversations.handlers.list_conversations(mockClient, { scope: "unread", filter: "course_123" });
  assert.strictEqual(calledUrl, "/api/v1/conversations");
  assert.deepStrictEqual(calledParams, { scope: "unread", filter: "course_123" });
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].subject, "Hello");
});

test("get_conversation calls the correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: {
          id: 1,
          subject: "Hello",
          workflow_state: "read",
          unread: false,
          message_count: 2,
          messages: [
            { id: 101, author_id: 10, body: "Hi there", created_at: "2026-07-04T00:00:00Z" },
          ],
          participants: [{ id: 10, name: "Student A" }],
        },
      };
    },
  };

  const result = await conversations.handlers.get_conversation(mockClient, { id: 1 });
  assert.strictEqual(calledUrl, "/api/v1/conversations/1");
  assert.strictEqual(result.messages.length, 1);
  assert.strictEqual(result.messages[0].body, "Hi there");
});

test("create_conversation calls POST with correct payload", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return {
        data: { id: 2, subject: "New Topic", workflow_state: "read" },
      };
    },
  };

  const result = await conversations.handlers.create_conversation(mockClient, {
    recipients: ["10", "11"],
    body: "Welcome!",
    subject: "New Topic",
    force_new: true,
  });

  assert.strictEqual(calledUrl, "/api/v1/conversations");
  assert.deepStrictEqual(calledData, {
    recipients: ["10", "11"],
    body: "Welcome!",
    subject: "New Topic",
    force_new: true,
  });
  assert.strictEqual(result.subject, "New Topic");
});

test("delete_conversation calls DELETE on correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    delete: async (url) => {
      calledUrl = url;
      return {
        data: { id: 1, subject: "Deleted", workflow_state: "deleted" },
      };
    },
  };

  const result = await conversations.handlers.delete_conversation(mockClient, { id: 1 });
  assert.strictEqual(calledUrl, "/api/v1/conversations/1");
  assert.strictEqual(result.workflow_state, "deleted");
});

test("list_communication_channels calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 5, address: "test@example.com", type: "email", position: 1, workflow_state: "active", user_id: 100 },
        ],
      };
    },
  };

  const result = await conversations.handlers.list_communication_channels(mockClient, { user_id: "self" });
  assert.strictEqual(calledUrl, "/api/v1/users/self/communication_channels");
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].address, "test@example.com");
});

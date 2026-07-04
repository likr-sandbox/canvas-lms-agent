const test = require("node:test");
const assert = require("node:assert");
const authentications = require("../tools/authentications");

test("list_access_tokens tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: [] };
    }
  };

  const result = await authentications.handlers.list_access_tokens(mockClient, { user_id: "self" });
  assert.strictEqual(calledUrl, "/api/v1/users/self/tokens");
  assert.ok(Array.isArray(result));
});

test("create_access_token tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 1, purpose: "Test" } };
    }
  };

  const result = await authentications.handlers.create_access_token(mockClient, {
    user_id: "self",
    purpose: "Test",
    expires_at: "2026-12-31T23:59:59Z"
  });
  assert.strictEqual(calledUrl, "/api/v1/users/self/tokens");
  assert.deepStrictEqual(calledData, { access_token: { purpose: "Test", expires_at: "2026-12-31T23:59:59Z" } });
  assert.strictEqual(result.id, 1);
});

test("get_access_token tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: { id: 1 } };
    }
  };

  const result = await authentications.handlers.get_access_token(mockClient, { user_id: "self", id: 1 });
  assert.strictEqual(calledUrl, "/api/v1/users/self/tokens/1");
  assert.strictEqual(result.id, 1);
});

test("update_access_token tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    put: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 1, purpose: "New" } };
    }
  };

  const result = await authentications.handlers.update_access_token(mockClient, {
    user_id: "self",
    id: 1,
    purpose: "New"
  });
  assert.strictEqual(calledUrl, "/api/v1/users/self/tokens/1");
  assert.deepStrictEqual(calledData, { access_token: { purpose: "New", expires_at: undefined } });
  assert.strictEqual(result.purpose, "New");
});

test("delete_access_token tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    delete: async (url) => {
      calledUrl = url;
      return { data: { status: "deleted" } };
    }
  };

  const result = await authentications.handlers.delete_access_token(mockClient, { user_id: "self", id: 1 });
  assert.strictEqual(calledUrl, "/api/v1/users/self/tokens/1");
  assert.strictEqual(result.status, "deleted");
});

test("list_developer_keys tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: [] };
    }
  };

  const result = await authentications.handlers.list_developer_keys(mockClient, { account_id: 1 });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/developer_keys");
  assert.ok(Array.isArray(result));
});

test("create_developer_key tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 100 } };
    }
  };

  const keyConfig = { name: "Test Key" };
  const result = await authentications.handlers.create_developer_key(mockClient, { account_id: 1, developer_key: keyConfig });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/developer_keys");
  assert.deepStrictEqual(calledData, { developer_key: keyConfig });
  assert.strictEqual(result.id, 100);
});

test("update_developer_key tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    put: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 100 } };
    }
  };

  const keyConfig = { name: "Updated Key" };
  const result = await authentications.handlers.update_developer_key(mockClient, { id: 100, developer_key: keyConfig });
  assert.strictEqual(calledUrl, "/api/v1/developer_keys/100");
  assert.deepStrictEqual(calledData, { developer_key: keyConfig });
  assert.strictEqual(result.id, 100);
});

test("delete_developer_key tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    delete: async (url) => {
      calledUrl = url;
      return { data: { status: "deleted" } };
    }
  };

  const result = await authentications.handlers.delete_developer_key(mockClient, { id: 100 });
  assert.strictEqual(calledUrl, "/api/v1/developer_keys/100");
  assert.strictEqual(result.status, "deleted");
});

test("list_auth_providers tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: [] };
    }
  };

  const result = await authentications.handlers.list_auth_providers(mockClient, { account_id: 1 });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/authentication_providers");
  assert.ok(Array.isArray(result));
});

test("create_auth_provider tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 5 } };
    }
  };

  const providerConfig = { auth_type: "saml" };
  const result = await authentications.handlers.create_auth_provider(mockClient, { account_id: 1, authentication_provider: providerConfig });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/authentication_providers");
  assert.deepStrictEqual(calledData, { authentication_provider: providerConfig });
  assert.strictEqual(result.id, 5);
});

test("get_auth_provider tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return { data: { id: 5 } };
    }
  };

  const result = await authentications.handlers.get_auth_provider(mockClient, { account_id: 1, id: 5 });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/authentication_providers/5");
  assert.strictEqual(result.id, 5);
});

test("update_auth_provider tool calls correct endpoint", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    put: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return { data: { id: 5 } };
    }
  };

  const providerConfig = { auth_type: "saml" };
  const result = await authentications.handlers.update_auth_provider(mockClient, { account_id: 1, id: 5, authentication_provider: providerConfig });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/authentication_providers/5");
  assert.deepStrictEqual(calledData, { authentication_provider: providerConfig });
  assert.strictEqual(result.id, 5);
});

test("delete_auth_provider tool calls correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    delete: async (url) => {
      calledUrl = url;
      return { data: { status: "deleted" } };
    }
  };

  const result = await authentications.handlers.delete_auth_provider(mockClient, { account_id: 1, id: 5 });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/authentication_providers/5");
  assert.strictEqual(result.status, "deleted");
});

const test = require("node:test");
const assert = require("node:assert");
const accounts = require("../tools/accounts");

test("list_accounts calls the correct endpoint and returns formatted accounts", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 1, name: "Root Account", parent_account_id: null, root_account_id: null, workflow_state: "active" },
        ],
      };
    },
  };

  const result = await accounts.handlers.list_accounts(mockClient);
  assert.strictEqual(calledUrl, "/api/v1/accounts");
  assert.deepStrictEqual(result, [
    { id: 1, name: "Root Account", parent_account_id: null, root_account_id: null, workflow_state: "active" },
  ]);
});

test("get_account calls the correct endpoint and returns account details", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: { id: 1, name: "Root Account", parent_account_id: null, root_account_id: null, workflow_state: "active" },
      };
    },
  };

  const result = await accounts.handlers.get_account(mockClient, { id: 1 });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1");
  assert.deepStrictEqual(result, {
    id: 1,
    name: "Root Account",
    parent_account_id: null,
    root_account_id: null,
    workflow_state: "active",
  });
});

test("list_admins calls the correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: [
          { id: 10, role: "AccountAdmin", role_id: 2, user: { id: 100, name: "Admin User", login_id: "admin1" } },
        ],
      };
    },
  };

  const result = await accounts.handlers.list_admins(mockClient, { account_id: 1 });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/admins");
  assert.deepStrictEqual(result, [
    { id: 10, role: "AccountAdmin", role_id: 2, user: { id: 100, name: "Admin User", login_id: "admin1" } },
  ]);
});

test("add_admin calls POST with correct payload", async () => {
  let calledUrl = null;
  let calledData = null;
  const mockClient = {
    post: async (url, data) => {
      calledUrl = url;
      calledData = data;
      return {
        data: { id: 11, role: "AccountAdmin", role_id: 2, user: { id: 101, name: "New Admin", login_id: "admin2" } },
      };
    },
  };

  const result = await accounts.handlers.add_admin(mockClient, { account_id: 1, user_id: 101, role: "AccountAdmin" });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/admins");
  assert.deepStrictEqual(calledData, { user_id: 101, role: "AccountAdmin" });
  assert.deepStrictEqual(result, {
    id: 11,
    role: "AccountAdmin",
    role_id: 2,
    user: { id: 101, name: "New Admin", login_id: "admin2" },
  });
});

test("remove_admin calls DELETE with correct params", async () => {
  let calledUrl = null;
  let calledParams = null;
  const mockClient = {
    delete: async (url, config) => {
      calledUrl = url;
      calledParams = config?.params;
      return {
        data: { id: 11, role: "AccountAdmin", role_id: 2, user: { id: 101, name: "New Admin", login_id: "admin2" } },
      };
    },
  };

  const result = await accounts.handlers.remove_admin(mockClient, { account_id: 1, user_id: 101, role: "AccountAdmin" });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/admins/101");
  assert.deepStrictEqual(calledParams, { role: "AccountAdmin" });
});

test("list_roles calls the correct endpoint", async () => {
  let calledUrl = null;
  let calledParams = null;
  const mockClient = {
    get: async (url, config) => {
      calledUrl = url;
      calledParams = config?.params;
      return {
        data: [
          { id: 2, role: "AccountAdmin", label: "Account Admin", base_role_type: "AccountMembership", workflow_state: "active" },
        ],
      };
    },
  };

  const result = await accounts.handlers.list_roles(mockClient, { account_id: 1, show_inherited: true });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/roles");
  assert.deepStrictEqual(calledParams, { show_inherited: true });
  assert.deepStrictEqual(result, [
    { id: 2, role: "AccountAdmin", label: "Account Admin", base_role_type: "AccountMembership", workflow_state: "active" },
  ]);
});

test("get_role calls the correct endpoint", async () => {
  let calledUrl = null;
  const mockClient = {
    get: async (url) => {
      calledUrl = url;
      return {
        data: { id: 2, role: "AccountAdmin", label: "Account Admin", base_role_type: "AccountMembership", workflow_state: "active" },
      };
    },
  };

  const result = await accounts.handlers.get_role(mockClient, { account_id: 1, role: "AccountAdmin" });
  assert.strictEqual(calledUrl, "/api/v1/accounts/1/roles/AccountAdmin");
  assert.deepStrictEqual(result, {
    id: 2,
    role: "AccountAdmin",
    label: "Account Admin",
    base_role_type: "AccountMembership",
    workflow_state: "active",
  });
});

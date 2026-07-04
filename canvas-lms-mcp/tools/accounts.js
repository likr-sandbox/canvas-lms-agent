const definitions = [
  {
    name: "list_accounts",
    description: "Retrieves a list of accounts that the current user can view or manage.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_account",
    description: "Retrieves details for a specific account by ID.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The unique ID of the account.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_admins",
    description: "Lists all administrators associated with a specific account.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account.",
        },
      },
      required: ["account_id"],
    },
  },
  {
    name: "add_admin",
    description: "Flags a user as an administrator of the given account.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account.",
        },
        user_id: {
          type: "number",
          description: "The user ID of the person to promote to admin.",
        },
        role: {
          type: "string",
          description: "The admin role (e.g. 'AccountAdmin'). Defaults to 'AccountAdmin'.",
        },
        role_id: {
          type: "number",
          description: "The unique ID of the role.",
        },
      },
      required: ["account_id", "user_id"],
    },
  },
  {
    name: "remove_admin",
    description: "Removes administrator privileges from a user for the given account.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account.",
        },
        user_id: {
          type: "number",
          description: "The user ID of the person to remove admin privileges from.",
        },
        role: {
          type: "string",
          description: "The admin role. Defaults to 'AccountAdmin'.",
        },
        role_id: {
          type: "number",
          description: "The unique ID of the role.",
        },
      },
      required: ["account_id", "user_id"],
    },
  },
  {
    name: "list_roles",
    description: "Lists custom and built-in roles available to an account.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account.",
        },
        show_inherited: {
          type: "boolean",
          description: "Whether to include roles inherited from parent accounts.",
        },
      },
      required: ["account_id"],
    },
  },
  {
    name: "get_role",
    description: "Retrieves details of a specific role by role ID or name.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account.",
        },
        id: {
          type: "number",
          description: "The unique ID of the role.",
        },
        role: {
          type: "string",
          description: "The name of the role.",
        },
      },
      required: ["account_id"],
    },
  },
];

const handlers = {
  list_accounts: async (client) => {
    const response = await client.get("/api/v1/accounts");
    const accounts = Array.isArray(response.data) ? response.data : [];
    return accounts.map(acc => ({
      id: acc.id,
      name: acc.name,
      parent_account_id: acc.parent_account_id,
      root_account_id: acc.root_account_id,
      workflow_state: acc.workflow_state,
    }));
  },

  get_account: async (client, args) => {
    const id = args.id;
    if (!id) {
      throw new Error("Missing required argument: id");
    }
    const response = await client.get(`/api/v1/accounts/${id}`);
    const acc = response.data || {};
    return {
      id: acc.id,
      name: acc.name,
      parent_account_id: acc.parent_account_id,
      root_account_id: acc.root_account_id,
      workflow_state: acc.workflow_state,
    };
  },

  list_admins: async (client, args) => {
    const account_id = args.account_id;
    if (!account_id) {
      throw new Error("Missing required argument: account_id");
    }
    const response = await client.get(`/api/v1/accounts/${account_id}/admins`);
    const admins = Array.isArray(response.data) ? response.data : [];
    return admins.map(adm => ({
      id: adm.id,
      role: adm.role,
      role_id: adm.role_id,
      user: adm.user ? {
        id: adm.user.id,
        name: adm.user.name,
        login_id: adm.user.login_id,
      } : null,
    }));
  },

  add_admin: async (client, args) => {
    const { account_id, user_id, role, role_id } = args;
    if (!account_id || !user_id) {
      throw new Error("Missing required arguments: account_id, user_id");
    }
    const payload = {
      user_id,
    };
    if (role) payload.role = role;
    if (role_id) payload.role_id = role_id;

    const response = await client.post(`/api/v1/accounts/${account_id}/admins`, payload);
    const adm = response.data || {};
    return {
      id: adm.id,
      role: adm.role,
      role_id: adm.role_id,
      user: adm.user ? {
        id: adm.user.id,
        name: adm.user.name,
        login_id: adm.user.login_id,
      } : null,
    };
  },

  remove_admin: async (client, args) => {
    const { account_id, user_id, role, role_id } = args;
    if (!account_id || !user_id) {
      throw new Error("Missing required arguments: account_id, user_id");
    }
    const params = {};
    if (role) params.role = role;
    if (role_id) params.role_id = role_id;

    const response = await client.delete(`/api/v1/accounts/${account_id}/admins/${user_id}`, { params });
    const adm = response.data || {};
    return {
      id: adm.id,
      role: adm.role,
      role_id: adm.role_id,
      user: adm.user ? {
        id: adm.user.id,
        name: adm.user.name,
        login_id: adm.user.login_id,
      } : null,
    };
  },

  list_roles: async (client, args) => {
    const account_id = args.account_id;
    if (!account_id) {
      throw new Error("Missing required argument: account_id");
    }
    const params = {};
    if (args.show_inherited !== undefined) {
      params.show_inherited = args.show_inherited;
    }
    const response = await client.get(`/api/v1/accounts/${account_id}/roles`, { params });
    const roles = Array.isArray(response.data) ? response.data : [];
    return roles.map(role => ({
      id: role.id,
      role: role.role,
      label: role.label,
      base_role_type: role.base_role_type,
      workflow_state: role.workflow_state,
    }));
  },

  get_role: async (client, args) => {
    const { account_id, id, role } = args;
    if (!account_id) {
      throw new Error("Missing required argument: account_id");
    }
    if (!id && !role) {
      throw new Error("Missing required argument: id or role name");
    }
    const roleIdentifier = id || role;
    const response = await client.get(`/api/v1/accounts/${account_id}/roles/${roleIdentifier}`);
    const r = response.data || {};
    return {
      id: r.id,
      role: r.role,
      label: r.label,
      base_role_type: r.base_role_type,
      workflow_state: r.workflow_state,
    };
  },
};

module.exports = {
  definitions,
  handlers,
};

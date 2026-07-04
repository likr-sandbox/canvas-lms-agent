const definitions = [
  {
    name: "list_access_tokens",
    description: "Lists access tokens for a user.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or 'self'."
        }
      },
      required: ["user_id"]
    }
  },
  {
    name: "create_access_token",
    description: "Creates an access token for a user.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or 'self'."
        },
        purpose: {
          type: "string",
          description: "Optional purpose/name of the token."
        },
        expires_at: {
          type: "string",
          description: "Optional expiration date/time."
        }
      },
      required: ["user_id"]
    }
  },
  {
    name: "get_access_token",
    description: "Retrieves details of a specific access token.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or 'self'."
        },
        id: {
          type: "number",
          description: "The unique ID of the access token."
        }
      },
      required: ["user_id", "id"]
    }
  },
  {
    name: "update_access_token",
    description: "Updates an access token.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or 'self'."
        },
        id: {
          type: "number",
          description: "The unique ID of the access token."
        },
        purpose: {
          type: "string",
          description: "Optional purpose/name of the token."
        },
        expires_at: {
          type: "string",
          description: "Optional expiration date/time."
        }
      },
      required: ["user_id", "id"]
    }
  },
  {
    name: "delete_access_token",
    description: "Deletes an access token.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or 'self'."
        },
        id: {
          type: "number",
          description: "The unique ID of the access token."
        }
      },
      required: ["user_id", "id"]
    }
  },
  {
    name: "list_developer_keys",
    description: "Lists developer keys for an account.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account."
        }
      },
      required: ["account_id"]
    }
  },
  {
    name: "create_developer_key",
    description: "Creates a developer key for an account.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account."
        },
        developer_key: {
          type: "object",
          description: "The developer key configuration details."
        }
      },
      required: ["account_id", "developer_key"]
    }
  },
  {
    name: "update_developer_key",
    description: "Updates an existing developer key.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The unique ID of the developer key."
        },
        developer_key: {
          type: "object",
          description: "The updated developer key configuration details."
        }
      },
      required: ["id", "developer_key"]
    }
  },
  {
    name: "delete_developer_key",
    description: "Deletes a developer key.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The unique ID of the developer key."
        }
      },
      required: ["id"]
    }
  },
  {
    name: "list_auth_providers",
    description: "Lists authentication providers for an account.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account."
        }
      },
      required: ["account_id"]
    }
  },
  {
    name: "create_auth_provider",
    description: "Creates an authentication provider for an account.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account."
        },
        authentication_provider: {
          type: "object",
          description: "The authentication provider configuration details."
        }
      },
      required: ["account_id", "authentication_provider"]
    }
  },
  {
    name: "get_auth_provider",
    description: "Retrieves details of an authentication provider.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account."
        },
        id: {
          type: "number",
          description: "The unique ID of the authentication provider."
        }
      },
      required: ["account_id", "id"]
    }
  },
  {
    name: "update_auth_provider",
    description: "Updates an authentication provider.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account."
        },
        id: {
          type: "number",
          description: "The unique ID of the authentication provider."
        },
        authentication_provider: {
          type: "object",
          description: "The updated authentication provider configuration details."
        }
      },
      required: ["account_id", "id", "authentication_provider"]
    }
  },
  {
    name: "delete_auth_provider",
    description: "Deletes an authentication provider.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account."
        },
        id: {
          type: "number",
          description: "The unique ID of the authentication provider."
        }
      },
      required: ["account_id", "id"]
    }
  }
];

const handlers = {
  list_access_tokens: async (client, args) => {
    const { user_id } = args;
    const response = await client.get(`/api/v1/users/${user_id}/tokens`);
    return response.data;
  },

  create_access_token: async (client, args) => {
    const { user_id, purpose, expires_at } = args;
    const response = await client.post(`/api/v1/users/${user_id}/tokens`, {
      access_token: { purpose, expires_at }
    });
    return response.data;
  },

  get_access_token: async (client, args) => {
    const { user_id, id } = args;
    const response = await client.get(`/api/v1/users/${user_id}/tokens/${id}`);
    return response.data;
  },

  update_access_token: async (client, args) => {
    const { user_id, id, purpose, expires_at } = args;
    const response = await client.put(`/api/v1/users/${user_id}/tokens/${id}`, {
      access_token: { purpose, expires_at }
    });
    return response.data;
  },

  delete_access_token: async (client, args) => {
    const { user_id, id } = args;
    const response = await client.delete(`/api/v1/users/${user_id}/tokens/${id}`);
    return response.data;
  },

  list_developer_keys: async (client, args) => {
    const { account_id } = args;
    const response = await client.get(`/api/v1/accounts/${account_id}/developer_keys`);
    return response.data;
  },

  create_developer_key: async (client, args) => {
    const { account_id, developer_key } = args;
    const response = await client.post(`/api/v1/accounts/${account_id}/developer_keys`, {
      developer_key
    });
    return response.data;
  },

  update_developer_key: async (client, args) => {
    const { id, developer_key } = args;
    const response = await client.put(`/api/v1/developer_keys/${id}`, {
      developer_key
    });
    return response.data;
  },

  delete_developer_key: async (client, args) => {
    const { id } = args;
    const response = await client.delete(`/api/v1/developer_keys/${id}`);
    return response.data;
  },

  list_auth_providers: async (client, args) => {
    const { account_id } = args;
    const response = await client.get(`/api/v1/accounts/${account_id}/authentication_providers`);
    return response.data;
  },

  create_auth_provider: async (client, args) => {
    const { account_id, authentication_provider } = args;
    const response = await client.post(`/api/v1/accounts/${account_id}/authentication_providers`, {
      authentication_provider
    });
    return response.data;
  },

  get_auth_provider: async (client, args) => {
    const { account_id, id } = args;
    const response = await client.get(`/api/v1/accounts/${account_id}/authentication_providers/${id}`);
    return response.data;
  },

  update_auth_provider: async (client, args) => {
    const { account_id, id, authentication_provider } = args;
    const response = await client.put(`/api/v1/accounts/${account_id}/authentication_providers/${id}`, {
      authentication_provider
    });
    return response.data;
  },

  delete_auth_provider: async (client, args) => {
    const { account_id, id } = args;
    const response = await client.delete(`/api/v1/accounts/${account_id}/authentication_providers/${id}`);
    return response.data;
  }
};

module.exports = {
  definitions,
  handlers
};

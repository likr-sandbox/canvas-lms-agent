const definitions = [
  {
    name: "list_appointment_groups",
    description: "Lists appointment groups.",
    inputSchema: {
      type: "object",
      properties: {
        scope: {
          type: "string",
          description: "Optional scope ('user' or 'manage')."
        },
        context_codes: {
          type: "array",
          items: { type: "string" },
          description: "Optional array of context codes to filter by."
        }
      }
    }
  },
  {
    name: "create_appointment_group",
    description: "Creates an appointment group.",
    inputSchema: {
      type: "object",
      properties: {
        appointment_group: {
          type: "object",
          description: "The appointment group details."
        }
      },
      required: ["appointment_group"]
    }
  },
  {
    name: "get_appointment_group",
    description: "Retrieves details of an appointment group.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The unique ID of the appointment group."
        }
      },
      required: ["id"]
    }
  },
  {
    name: "update_appointment_group",
    description: "Updates an appointment group.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The unique ID of the appointment group."
        },
        appointment_group: {
          type: "object",
          description: "The updated appointment group details."
        }
      },
      required: ["id", "appointment_group"]
    }
  },
  {
    name: "delete_appointment_group",
    description: "Deletes an appointment group.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The unique ID of the appointment group."
        },
        cancel_reason: {
          type: "string",
          description: "Optional reason for cancellation."
        }
      },
      required: ["id"]
    }
  },
  {
    name: "list_features",
    description: "Lists features for a course, account, or user.",
    inputSchema: {
      type: "object",
      properties: {
        context_type: {
          type: "string",
          description: "The context type: 'courses', 'accounts', or 'users'."
        },
        context_id: {
          type: "string",
          description: "The context ID (e.g. course ID, account ID, or user ID)."
        }
      },
      required: ["context_type", "context_id"]
    }
  },
  {
    name: "get_feature_flag",
    description: "Retrieves the feature flag for a course, account, or user.",
    inputSchema: {
      type: "object",
      properties: {
        context_type: {
          type: "string",
          description: "The context type: 'courses', 'accounts', or 'users'."
        },
        context_id: {
          type: "string",
          description: "The context ID."
        },
        feature: {
          type: "string",
          description: "The name of the feature."
        }
      },
      required: ["context_type", "context_id", "feature"]
    }
  },
  {
    name: "set_feature_flag",
    description: "Sets the feature flag for a course, account, or user.",
    inputSchema: {
      type: "object",
      properties: {
        context_type: {
          type: "string",
          description: "The context type: 'courses', 'accounts', or 'users'."
        },
        context_id: {
          type: "string",
          description: "The context ID."
        },
        feature: {
          type: "string",
          description: "The name of the feature."
        },
        state: {
          type: "string",
          description: "The feature flag state: 'on', 'off', or 'allowed'."
        }
      },
      required: ["context_type", "context_id", "feature"]
    }
  },
  {
    name: "delete_feature_flag",
    description: "Removes the feature flag for a course, account, or user.",
    inputSchema: {
      type: "object",
      properties: {
        context_type: {
          type: "string",
          description: "The context type: 'courses', 'accounts', or 'users'."
        },
        context_id: {
          type: "string",
          description: "The context ID."
        },
        feature: {
          type: "string",
          description: "The name of the feature to remove."
        }
      },
      required: ["context_type", "context_id", "feature"]
    }
  },
  {
    name: "list_notification_preferences",
    description: "Lists notification preferences for a communication channel.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or 'self'."
        },
        communication_channel_id: {
          type: "number",
          description: "The unique ID of the communication channel."
        }
      },
      required: ["user_id", "communication_channel_id"]
    }
  },
  {
    name: "get_notification_preference",
    description: "Retrieves details of a specific notification preference category.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or 'self'."
        },
        communication_channel_id: {
          type: "number",
          description: "The unique ID of the communication channel."
        },
        category: {
          type: "string",
          description: "The notification category name."
        }
      },
      required: ["user_id", "communication_channel_id", "category"]
    }
  },
  {
    name: "update_notification_preference",
    description: "Updates a notification preference for the current user.",
    inputSchema: {
      type: "object",
      properties: {
        communication_channel_id: {
          type: "number",
          description: "The unique ID of the communication channel."
        },
        category: {
          type: "string",
          description: "The notification category name."
        },
        frequency: {
          type: "string",
          description: "The preference frequency ('immediately', 'daily', 'weekly', 'never')."
        }
      },
      required: ["communication_channel_id", "category", "frequency"]
    }
  },
  {
    name: "update_multiple_notification_preferences",
    description: "Updates multiple notification preferences for the current user.",
    inputSchema: {
      type: "object",
      properties: {
        communication_channel_id: {
          type: "number",
          description: "The unique ID of the communication channel."
        },
        notification_preferences: {
          type: "object",
          description: "The notification preferences map (category -> frequency)."
        }
      },
      required: ["communication_channel_id", "notification_preferences"]
    }
  }
];

const handlers = {
  list_appointment_groups: async (client, args) => {
    const { scope, context_codes } = args;
    const response = await client.get(`/api/v1/appointment_groups`, {
      params: { scope, context_codes }
    });
    return response.data;
  },

  create_appointment_group: async (client, args) => {
    const { appointment_group } = args;
    const response = await client.post(`/api/v1/appointment_groups`, {
      appointment_group
    });
    return response.data;
  },

  get_appointment_group: async (client, args) => {
    const { id } = args;
    const response = await client.get(`/api/v1/appointment_groups/${id}`);
    return response.data;
  },

  update_appointment_group: async (client, args) => {
    const { id, appointment_group } = args;
    const response = await client.put(`/api/v1/appointment_groups/${id}`, {
      appointment_group
    });
    return response.data;
  },

  delete_appointment_group: async (client, args) => {
    const { id, cancel_reason } = args;
    const response = await client.delete(`/api/v1/appointment_groups/${id}`, {
      params: { cancel_reason }
    });
    return response.data;
  },

  list_features: async (client, args) => {
    const { context_type, context_id } = args;
    const response = await client.get(`/api/v1/${context_type}/${context_id}/features`);
    return response.data;
  },

  get_feature_flag: async (client, args) => {
    const { context_type, context_id, feature } = args;
    const response = await client.get(`/api/v1/${context_type}/${context_id}/features/flags/${feature}`);
    return response.data;
  },

  set_feature_flag: async (client, args) => {
    const { context_type, context_id, feature, state } = args;
    const response = await client.put(`/api/v1/${context_type}/${context_id}/features/flags/${feature}`, {
      state
    });
    return response.data;
  },

  delete_feature_flag: async (client, args) => {
    const { context_type, context_id, feature } = args;
    const response = await client.delete(`/api/v1/${context_type}/${context_id}/features/flags/${feature}`);
    return response.data;
  },

  list_notification_preferences: async (client, args) => {
    const { user_id, communication_channel_id } = args;
    const response = await client.get(`/api/v1/users/${user_id}/communication_channels/${communication_channel_id}/notification_preferences`);
    return response.data;
  },

  get_notification_preference: async (client, args) => {
    const { user_id, communication_channel_id, category } = args;
    const response = await client.get(`/api/v1/users/${user_id}/communication_channels/${communication_channel_id}/notification_preferences/${category}`);
    return response.data;
  },

  update_notification_preference: async (client, args) => {
    const { communication_channel_id, category, frequency } = args;
    const response = await client.put(`/api/v1/users/self/communication_channels/${communication_channel_id}/notification_preferences/${category}`, {
      notification_preferences: { frequency }
    });
    return response.data;
  },

  update_multiple_notification_preferences: async (client, args) => {
    const { communication_channel_id, notification_preferences } = args;
    const response = await client.put(`/api/v1/users/self/communication_channels/${communication_channel_id}/notification_preferences`, {
      notification_preferences
    });
    return response.data;
  }
};

module.exports = {
  definitions,
  handlers
};

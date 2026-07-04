const definitions = [
  {
    name: "list_conversations",
    description: "Returns a list of conversations (inbox messages) for the current user.",
    inputSchema: {
      type: "object",
      properties: {
        scope: {
          type: "string",
          description: "One of 'unread', 'starred', 'archived', or 'sent'.",
        },
        filter: {
          type: "string",
          description: "Filter conversations by course, group, or user (e.g. 'course_123').",
        },
      },
    },
  },
  {
    name: "get_conversation",
    description: "Returns details of a specific conversation, including messages.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The unique ID of the conversation.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "create_conversation",
    description: "Create a new conversation (send a message to one or more recipients).",
    inputSchema: {
      type: "object",
      properties: {
        recipients: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of user IDs or course/group section tags to message.",
        },
        body: {
          type: "string",
          description: "The message body content.",
        },
        subject: {
          type: "string",
          description: "The subject of the conversation (optional).",
        },
        force_new: {
          type: "boolean",
          description: "If true, starts a new conversation instead of adding to an existing one.",
        },
      },
      required: ["recipients", "body"],
    },
  },
  {
    name: "delete_conversation",
    description: "Deletes a conversation by ID.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The unique ID of the conversation.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_communication_channels",
    description: "Retrieves communication channels (email, SMS, push) for a user.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The unique ID of the user. Can be 'self' to query the current user.",
        },
      },
      required: ["user_id"],
    },
  },
];

const handlers = {
  list_conversations: async (client, args) => {
    const params = {};
    if (args.scope) params.scope = args.scope;
    if (args.filter) params.filter = args.filter;

    const response = await client.get("/api/v1/conversations", { params });
    const conversations = Array.isArray(response.data) ? response.data : [];
    return conversations.map(c => ({
      id: c.id,
      subject: c.subject,
      workflow_state: c.workflow_state,
      last_message: c.last_message,
      last_message_at: c.last_message_at,
      message_count: c.message_count,
      unread: c.unread,
      participants: c.participants ? c.participants.map(p => ({
        id: p.id,
        name: p.name,
      })) : [],
    }));
  },

  get_conversation: async (client, args) => {
    const id = args.id;
    if (!id) {
      throw new Error("Missing required argument: id");
    }
    const response = await client.get(`/api/v1/conversations/${id}`);
    const c = response.data || {};
    return {
      id: c.id,
      subject: c.subject,
      workflow_state: c.workflow_state,
      unread: c.unread,
      message_count: c.message_count,
      messages: c.messages ? c.messages.map(m => ({
        id: m.id,
        author_id: m.author_id,
        body: m.body,
        created_at: m.created_at,
      })) : [],
      participants: c.participants ? c.participants.map(p => ({
        id: p.id,
        name: p.name,
      })) : [],
    };
  },

  create_conversation: async (client, args) => {
    const { recipients, body, subject, force_new } = args;
    if (!recipients || !body) {
      throw new Error("Missing required arguments: recipients, body");
    }
    const payload = {
      recipients,
      body,
    };
    if (subject) payload.subject = subject;
    if (force_new !== undefined) payload.force_new = force_new;

    const response = await client.post("/api/v1/conversations", payload);
    // POST returns a single conversation or list of conversations depending on force_new or bulk options.
    // Standard response is usually an array (if multiple conversations are created) or a single object.
    const data = response.data;
    if (Array.isArray(data)) {
      return data.map(c => ({
        id: c.id,
        subject: c.subject,
        workflow_state: c.workflow_state,
      }));
    }
    return {
      id: data.id,
      subject: data.subject,
      workflow_state: data.workflow_state,
    };
  },

  delete_conversation: async (client, args) => {
    const id = args.id;
    if (!id) {
      throw new Error("Missing required argument: id");
    }
    const response = await client.delete(`/api/v1/conversations/${id}`);
    const c = response.data || {};
    return {
      id: c.id,
      subject: c.subject,
      workflow_state: c.workflow_state,
    };
  },

  list_communication_channels: async (client, args) => {
    const user_id = args.user_id;
    if (!user_id) {
      throw new Error("Missing required argument: user_id");
    }
    const response = await client.get(`/api/v1/users/${user_id}/communication_channels`);
    const channels = Array.isArray(response.data) ? response.data : [];
    return channels.map(ch => ({
      id: ch.id,
      address: ch.address,
      type: ch.type,
      position: ch.position,
      workflow_state: ch.workflow_state,
      user_id: ch.user_id,
    }));
  },
};

module.exports = {
  definitions,
  handlers,
};

const definitions = [
  {
    name: "get_sis_import",
    description: "Retrieves the status of a specific SIS import.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account.",
        },
        id: {
          type: "number",
          description: "The unique ID of the SIS import.",
        },
      },
      required: ["account_id", "id"],
    },
  },
  {
    name: "create_sis_import",
    description: "Creates and starts a SIS import using CSV data.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account.",
        },
        import_type: {
          type: "string",
          description: "The type of data being imported (e.g. 'instructure_csv'). Defaults to 'instructure_csv'.",
        },
        csv_data: {
          type: "string",
          description: "The CSV text content to be imported.",
        },
      },
      required: ["account_id", "csv_data"],
    },
  },
  {
    name: "list_sis_assignments",
    description: "Lists assignments flagged as 'post_to_sis' enabled for grade export.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course.",
        },
      },
      required: ["course_id"],
    },
  },
  {
    name: "list_external_tools",
    description: "Lists external (LTI) tools installed in a course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course.",
        },
      },
      required: ["course_id"],
    },
  },
  {
    name: "get_external_tool",
    description: "Gets details of a specific external (LTI) tool by ID.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course.",
        },
        id: {
          type: "number",
          description: "The unique ID of the external tool.",
        },
      },
      required: ["course_id", "id"],
    },
  },
  {
    name: "create_external_tool",
    description: "Creates (installs) an external (LTI) tool in a course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course.",
        },
        name: {
          type: "string",
          description: "The name of the tool.",
        },
        consumer_key: {
          type: "string",
          description: "The LTI consumer key.",
        },
        shared_secret: {
          type: "string",
          description: "The LTI shared secret.",
        },
        config_type: {
          type: "string",
          description: "Configuration type (e.g. 'by_xml', 'by_url'). Defaults to 'by_url'.",
        },
        config_url: {
          type: "string",
          description: "The URL to configuration XML/JSON.",
        },
      },
      required: ["course_id", "name", "consumer_key", "shared_secret"],
    },
  },
  {
    name: "delete_external_tool",
    description: "Deletes an external (LTI) tool.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course.",
        },
        id: {
          type: "number",
          description: "The unique ID of the external tool.",
        },
      },
      required: ["course_id", "id"],
    },
  },
  {
    name: "list_lti_registrations",
    description: "Lists developer LTI registrations in an account.",
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
    name: "list_custom_gradebook_columns",
    description: "Lists custom columns in the gradebook for a course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course.",
        },
      },
      required: ["course_id"],
    },
  },
  {
    name: "create_custom_gradebook_column",
    description: "Creates a new custom gradebook column.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course.",
        },
        title: {
          type: "string",
          description: "The title of the column.",
        },
        position: {
          type: "number",
          description: "Order position of the column.",
        },
        hidden: {
          type: "boolean",
          description: "Whether the column is hidden from students.",
        },
      },
      required: ["course_id", "title"],
    },
  },
  {
    name: "update_custom_gradebook_column_data",
    description: "Updates data for a custom gradebook column for a student.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course.",
        },
        id: {
          type: "number",
          description: "The unique ID of the custom gradebook column.",
        },
        user_id: {
          type: "number",
          description: "The unique ID of the student user.",
        },
        content: {
          type: "string",
          description: "The text content value to save.",
        },
      },
      required: ["course_id", "id", "user_id", "content"],
    },
  },
];

const handlers = {
  get_sis_import: async (client, args) => {
    const { account_id, id } = args;
    if (!account_id || !id) {
      throw new Error("Missing required arguments: account_id, id");
    }
    const response = await client.get(`/api/v1/accounts/${account_id}/sis_imports/${id}`);
    const imp = response.data || {};
    return {
      id: imp.id,
      created_at: imp.created_at,
      ended_at: imp.ended_at,
      updated_at: imp.updated_at,
      workflow_state: imp.workflow_state,
      progress: imp.progress,
      import_type: imp.import_type,
    };
  },

  create_sis_import: async (client, args) => {
    const { account_id, csv_data, import_type = "instructure_csv" } = args;
    if (!account_id || !csv_data) {
      throw new Error("Missing required arguments: account_id, csv_data");
    }

    const response = await client.post(`/api/v1/accounts/${account_id}/sis_imports`, csv_data, {
      headers: {
        "Content-Type": "text/csv",
      },
      params: {
        import_type,
        extension: "csv"
      },
    });
    const imp = response.data || {};
    return {
      id: imp.id,
      workflow_state: imp.workflow_state,
      progress: imp.progress,
      import_type: imp.import_type,
    };
  },

  list_sis_assignments: async (client, args) => {
    const course_id = args.course_id;
    if (!course_id) {
      throw new Error("Missing required argument: course_id");
    }
    const response = await client.get(`/api/sis/courses/${course_id}/assignments`);
    const assignments = Array.isArray(response.data) ? response.data : [];
    return assignments.map(a => ({
      id: a.id,
      course_id: a.course_id,
      name: a.name,
      points_possible: a.points_possible,
      post_to_sis: a.post_to_sis,
      due_at: a.due_at,
    }));
  },

  list_external_tools: async (client, args) => {
    const course_id = args.course_id;
    if (!course_id) {
      throw new Error("Missing required argument: course_id");
    }
    const response = await client.get(`/api/v1/courses/${course_id}/external_tools`);
    const tools = Array.isArray(response.data) ? response.data : [];
    return tools.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      url: t.url,
      domain: t.domain,
      consumer_key: t.consumer_key,
    }));
  },

  get_external_tool: async (client, args) => {
    const { course_id, id } = args;
    if (!course_id || !id) {
      throw new Error("Missing required arguments: course_id, id");
    }
    const response = await client.get(`/api/v1/courses/${course_id}/external_tools/${id}`);
    const t = response.data || {};
    return {
      id: t.id,
      name: t.name,
      description: t.description,
      url: t.url,
      domain: t.domain,
      consumer_key: t.consumer_key,
    };
  },

  create_external_tool: async (client, args) => {
    const { course_id, name, consumer_key, shared_secret, config_type = "by_url", config_url } = args;
    if (!course_id || !name || !consumer_key || !shared_secret) {
      throw new Error("Missing required arguments: course_id, name, consumer_key, shared_secret");
    }
    const payload = {
      name,
      consumer_key,
      shared_secret,
      config_type,
    };
    if (config_url) payload.config_url = config_url;

    const response = await client.post(`/api/v1/courses/${course_id}/external_tools`, payload);
    const t = response.data || {};
    return {
      id: t.id,
      name: t.name,
      description: t.description,
      url: t.url,
      domain: t.domain,
    };
  },

  delete_external_tool: async (client, args) => {
    const { course_id, id } = args;
    if (!course_id || !id) {
      throw new Error("Missing required arguments: course_id, id");
    }
    const response = await client.delete(`/api/v1/courses/${course_id}/external_tools/${id}`);
    const t = response.data || {};
    return {
      id: t.id,
      name: t.name,
      workflow_state: t.workflow_state,
    };
  },

  list_lti_registrations: async (client, args) => {
    const account_id = args.account_id;
    if (!account_id) {
      throw new Error("Missing required argument: account_id");
    }
    const response = await client.get(`/api/v1/accounts/${account_id}/lti_registrations`);
    const regs = Array.isArray(response.data) ? response.data : [];
    return regs.map(r => ({
      id: r.id,
      client_id: r.client_id,
      workflow_state: r.workflow_state,
      platform_issuer: r.platform_issuer,
      created_at: r.created_at,
    }));
  },

  list_custom_gradebook_columns: async (client, args) => {
    const course_id = args.course_id;
    if (!course_id) {
      throw new Error("Missing required argument: course_id");
    }
    const response = await client.get(`/api/v1/courses/${course_id}/custom_gradebook_columns`);
    const cols = Array.isArray(response.data) ? response.data : [];
    return cols.map(c => ({
      id: c.id,
      title: c.title,
      position: c.position,
      hidden: c.hidden,
      teacher_notes: c.teacher_notes,
    }));
  },

  create_custom_gradebook_column: async (client, args) => {
    const { course_id, title, position, hidden } = args;
    if (!course_id || !title) {
      throw new Error("Missing required arguments: course_id, title");
    }
    const payload = {
      column: {
        title,
      },
    };
    if (position !== undefined) payload.column.position = position;
    if (hidden !== undefined) payload.column.hidden = hidden;

    const response = await client.post(`/api/v1/courses/${course_id}/custom_gradebook_columns`, payload);
    const c = response.data || {};
    return {
      id: c.id,
      title: c.title,
      position: c.position,
      hidden: c.hidden,
    };
  },

  update_custom_gradebook_column_data: async (client, args) => {
    const { course_id, id, user_id, content } = args;
    if (!course_id || !id || !user_id || !content) {
      throw new Error("Missing required arguments: course_id, id, user_id, content");
    }
    const payload = {
      column_data: {
        content,
      },
    };
    const response = await client.put(`/api/v1/courses/${course_id}/custom_gradebook_columns/${id}/data/${user_id}`, payload);
    const d = response.data || {};
    return {
      content: d.content,
      user_id: d.user_id,
    };
  },
};

module.exports = {
  definitions,
  handlers,
};

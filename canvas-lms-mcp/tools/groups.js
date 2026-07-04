const definitions = [
  {
    name: "list_groups",
    description: "Returns a list of active groups for the given course.",
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
    name: "get_group",
    description: "Returns details of a specific group.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The unique ID of the group.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "create_group",
    description: "Creates a new group for a course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course.",
        },
        name: {
          type: "string",
          description: "The name of the group.",
        },
        description: {
          type: "string",
          description: "A description of the group.",
        },
        is_public: {
          type: "boolean",
          description: "Whether the group is public.",
        },
        join_level: {
          type: "string",
          description: "How users join: 'parent_context_auto_join', 'parent_context_request', or 'invitation_only'.",
        },
      },
      required: ["course_id", "name"],
    },
  },
  {
    name: "delete_group",
    description: "Deletes a group.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The unique ID of the group.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_group_categories",
    description: "Returns a list of group categories for a course.",
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
    name: "get_group_category",
    description: "Returns details of a specific group category.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The unique ID of the group category.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "create_group_category",
    description: "Creates a new group category for a course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course.",
        },
        name: {
          type: "string",
          description: "The name of the category.",
        },
      },
      required: ["course_id", "name"],
    },
  },
  {
    name: "delete_group_category",
    description: "Deletes a group category.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The unique ID of the group category.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_collaborations",
    description: "Lists collaborations (e.g. Google Docs, Etherpad) for a course.",
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
];

const handlers = {
  list_groups: async (client, args) => {
    const course_id = args.course_id;
    if (!course_id) {
      throw new Error("Missing required argument: course_id");
    }
    const response = await client.get(`/api/v1/courses/${course_id}/groups`);
    const groups = Array.isArray(response.data) ? response.data : [];
    return groups.map(g => ({
      id: g.id,
      name: g.name,
      description: g.description,
      is_public: g.is_public,
      join_level: g.join_level,
      members_count: g.members_count,
    }));
  },

  get_group: async (client, args) => {
    const id = args.id;
    if (!id) {
      throw new Error("Missing required argument: id");
    }
    const response = await client.get(`/api/v1/groups/${id}`);
    const g = response.data || {};
    return {
      id: g.id,
      name: g.name,
      description: g.description,
      is_public: g.is_public,
      join_level: g.join_level,
      members_count: g.members_count,
    };
  },

  create_group: async (client, args) => {
    const { course_id, name, description, is_public, join_level } = args;
    if (!course_id || !name) {
      throw new Error("Missing required arguments: course_id, name");
    }
    const payload = {
      name,
    };
    if (description) payload.description = description;
    if (is_public !== undefined) payload.is_public = is_public;
    if (join_level) payload.join_level = join_level;

    const response = await client.post(`/api/v1/courses/${course_id}/groups`, payload);
    const g = response.data || {};
    return {
      id: g.id,
      name: g.name,
      description: g.description,
      is_public: g.is_public,
      join_level: g.join_level,
    };
  },

  delete_group: async (client, args) => {
    const id = args.id;
    if (!id) {
      throw new Error("Missing required argument: id");
    }
    const response = await client.delete(`/api/v1/groups/${id}`);
    const g = response.data || {};
    return {
      id: g.id,
      name: g.name,
      workflow_state: g.workflow_state,
    };
  },

  list_group_categories: async (client, args) => {
    const course_id = args.course_id;
    if (!course_id) {
      throw new Error("Missing required argument: course_id");
    }
    const response = await client.get(`/api/v1/courses/${course_id}/group_categories`);
    const cats = Array.isArray(response.data) ? response.data : [];
    return cats.map(c => ({
      id: c.id,
      name: c.name,
      role: c.role,
      self_signup: c.self_signup,
      context_type: c.context_type,
    }));
  },

  get_group_category: async (client, args) => {
    const id = args.id;
    if (!id) {
      throw new Error("Missing required argument: id");
    }
    const response = await client.get(`/api/v1/group_categories/${id}`);
    const c = response.data || {};
    return {
      id: c.id,
      name: c.name,
      role: c.role,
      self_signup: c.self_signup,
      context_type: c.context_type,
    };
  },

  create_group_category: async (client, args) => {
    const { course_id, name } = args;
    if (!course_id || !name) {
      throw new Error("Missing required arguments: course_id, name");
    }
    const response = await client.post(`/api/v1/courses/${course_id}/group_categories`, { name });
    const c = response.data || {};
    return {
      id: c.id,
      name: c.name,
      role: c.role,
      self_signup: c.self_signup,
    };
  },

  delete_group_category: async (client, args) => {
    const id = args.id;
    if (!id) {
      throw new Error("Missing required argument: id");
    }
    const response = await client.delete(`/api/v1/group_categories/${id}`);
    const c = response.data || {};
    return {
      id: c.id,
      name: c.name,
    };
  },

  list_collaborations: async (client, args) => {
    const course_id = args.course_id;
    if (!course_id) {
      throw new Error("Missing required argument: course_id");
    }
    const response = await client.get(`/api/v1/courses/${course_id}/collaborations`);
    const collabs = Array.isArray(response.data) ? response.data : [];
    return collabs.map(col => ({
      id: col.id,
      collaboration_type: col.collaboration_type,
      document_id: col.document_id,
      title: col.title,
      description: col.description,
      url: col.url,
    }));
  },
};

module.exports = {
  definitions,
  handlers,
};

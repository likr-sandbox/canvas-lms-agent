const definitions = [
  {
    name: "list_blueprint_templates",
    description: "Lists blueprint templates for a course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        }
      },
      required: ["course_id"]
    }
  },
  {
    name: "list_blueprint_associated_courses",
    description: "Lists associated courses for a blueprint template.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        template_id: {
          type: "string",
          description: "The blueprint template ID or 'default'."
        }
      },
      required: ["course_id", "template_id"]
    }
  },
  {
    name: "create_blueprint_migration",
    description: "Triggers a blueprint migration.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        template_id: {
          type: "string",
          description: "The blueprint template ID or 'default'."
        },
        comment: {
          type: "string",
          description: "Optional comment for the migration."
        },
        send_notification: {
          type: "boolean",
          description: "Whether to send a notification."
        },
        copy_settings: {
          type: "boolean",
          description: "Whether to copy settings."
        }
      },
      required: ["course_id", "template_id"]
    }
  },
  {
    name: "list_blueprint_migrations",
    description: "Lists blueprint migrations.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        template_id: {
          type: "string",
          description: "The blueprint template ID or 'default'."
        }
      },
      required: ["course_id", "template_id"]
    }
  },
  {
    name: "get_blueprint_migration",
    description: "Retrieves details of a specific blueprint migration.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        template_id: {
          type: "string",
          description: "The blueprint template ID or 'default'."
        },
        id: {
          type: "number",
          description: "The unique ID of the blueprint migration."
        }
      },
      required: ["course_id", "template_id", "id"]
    }
  },
  {
    name: "list_course_paces",
    description: "Lists course paces.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        }
      },
      required: ["course_id"]
    }
  },
  {
    name: "create_course_pace",
    description: "Creates a course pace.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        course_pace: {
          type: "object",
          description: "The course pace configuration details."
        }
      },
      required: ["course_id", "course_pace"]
    }
  },
  {
    name: "get_course_pace",
    description: "Retrieves details of a course pace.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        id: {
          type: "number",
          description: "The unique ID of the course pace."
        }
      },
      required: ["course_id", "id"]
    }
  },
  {
    name: "update_course_pace",
    description: "Updates a course pace.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        id: {
          type: "number",
          description: "The unique ID of the course pace."
        },
        course_pace: {
          type: "object",
          description: "The updated course pace configuration details."
        }
      },
      required: ["course_id", "id", "course_pace"]
    }
  },
  {
    name: "delete_course_pace",
    description: "Deletes a course pace.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        id: {
          type: "number",
          description: "The unique ID of the course pace."
        }
      },
      required: ["course_id", "id"]
    }
  },
  {
    name: "list_content_migrations",
    description: "Lists content migrations for a course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        }
      },
      required: ["course_id"]
    }
  },
  {
    name: "get_content_migration",
    description: "Retrieves status of a content migration.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        id: {
          type: "number",
          description: "The unique ID of the content migration."
        }
      },
      required: ["course_id", "id"]
    }
  },
  {
    name: "create_content_migration",
    description: "Creates a content migration.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        migration_type: {
          type: "string",
          description: "The type of migration (e.g. 'common_cartridge_importer')."
        },
        settings: {
          type: "object",
          description: "Optional settings for the migration."
        }
      },
      required: ["course_id", "migration_type"]
    }
  },
  {
    name: "update_content_migration",
    description: "Updates content migration configuration.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        id: {
          type: "number",
          description: "The unique ID of the content migration."
        },
        settings: {
          type: "object",
          description: "Optional updated settings."
        }
      },
      required: ["course_id", "id"]
    }
  }
];

const handlers = {
  list_blueprint_templates: async (client, args) => {
    const { course_id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/blueprint_templates`);
    return response.data;
  },

  list_blueprint_associated_courses: async (client, args) => {
    const { course_id, template_id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/blueprint_templates/${template_id}/associated_courses`);
    return response.data;
  },

  create_blueprint_migration: async (client, args) => {
    const { course_id, template_id, comment, send_notification, copy_settings } = args;
    const response = await client.post(`/api/v1/courses/${course_id}/blueprint_templates/${template_id}/migrations`, {
      comment,
      send_notification,
      copy_settings
    });
    return response.data;
  },

  list_blueprint_migrations: async (client, args) => {
    const { course_id, template_id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/blueprint_templates/${template_id}/migrations`);
    return response.data;
  },

  get_blueprint_migration: async (client, args) => {
    const { course_id, template_id, id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/blueprint_templates/${template_id}/migrations/${id}`);
    return response.data;
  },

  list_course_paces: async (client, args) => {
    const { course_id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/course_paces`);
    return response.data;
  },

  create_course_pace: async (client, args) => {
    const { course_id, course_pace } = args;
    const response = await client.post(`/api/v1/courses/${course_id}/course_paces`, {
      course_pace
    });
    return response.data;
  },

  get_course_pace: async (client, args) => {
    const { course_id, id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/course_paces/${id}`);
    return response.data;
  },

  update_course_pace: async (client, args) => {
    const { course_id, id, course_pace } = args;
    const response = await client.put(`/api/v1/courses/${course_id}/course_paces/${id}`, {
      course_pace
    });
    return response.data;
  },

  delete_course_pace: async (client, args) => {
    const { course_id, id } = args;
    const response = await client.delete(`/api/v1/courses/${course_id}/course_paces/${id}`);
    return response.data;
  },

  list_content_migrations: async (client, args) => {
    const { course_id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/content_migrations`);
    return response.data;
  },

  get_content_migration: async (client, args) => {
    const { course_id, id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/content_migrations/${id}`);
    return response.data;
  },

  create_content_migration: async (client, args) => {
    const { course_id, migration_type, settings } = args;
    const response = await client.post(`/api/v1/courses/${course_id}/content_migrations`, {
      migration_type,
      settings
    });
    return response.data;
  },

  update_content_migration: async (client, args) => {
    const { course_id, id, settings } = args;
    const response = await client.put(`/api/v1/courses/${course_id}/content_migrations/${id}`, {
      settings
    });
    return response.data;
  }
};

module.exports = {
  definitions,
  handlers
};

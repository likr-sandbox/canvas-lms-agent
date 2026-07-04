const definitions = [
  {
    name: "list_users",
    description: "Lists or searches users/students enrolled in a course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the Canvas course.",
        },
        search_term: {
          type: "string",
          description: "Optional. Search term to filter users by name.",
        },
      },
      required: ["course_id"],
    },
  },
];

const handlers = {
  list_users: async (client, args) => {
    const courseId = args.course_id;
    if (!courseId) {
      throw new Error("Missing required argument: course_id");
    }
    const params = {};
    if (args.search_term) {
      params.search_term = args.search_term;
    }
    const response = await client.get(`/api/v1/courses/${courseId}/users`, { params });
    const users = Array.isArray(response.data) ? response.data : [];
    return users.map(u => ({
      id: u.id,
      name: u.name,
      sortable_name: u.sortable_name,
      short_name: u.short_name,
      created_at: u.created_at,
    }));
  },
};

module.exports = {
  definitions,
  handlers,
};

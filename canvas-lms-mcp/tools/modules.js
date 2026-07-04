const definitions = [
  {
    name: "list_modules",
    description: "Retrieves the list of modules for a specific Canvas course, optionally including module items.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the Canvas course.",
        },
        include_items: {
          type: "boolean",
          description: "Optional. Set to true to include the items list within each module structure.",
        },
      },
      required: ["course_id"],
    },
  },
];

const handlers = {
  list_modules: async (client, args) => {
    const courseId = args.course_id;
    if (!courseId) {
      throw new Error("Missing required argument: course_id");
    }
    const params = {};
    if (args.include_items) {
      params["include[]"] = ["items"];
    }
    const response = await client.get(`/api/v1/courses/${courseId}/modules`, { params });
    const modules = Array.isArray(response.data) ? response.data : [];
    return modules.map(m => {
      const items = Array.isArray(m.items) ? m.items : [];
      const resultModule = {
        id: m.id,
        name: m.name,
        position: m.position,
        items_count: m.items_count,
      };
      if (args.include_items) {
        resultModule.items = items.map(item => ({
          id: item.id,
          title: item.title,
          type: item.type,
          external_url: item.external_url,
        }));
      }
      return resultModule;
    });
  },
};

module.exports = {
  definitions,
  handlers,
};

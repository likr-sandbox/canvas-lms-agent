const definitions = [
  {
    name: "list_files",
    description: "Retrieves the list of files uploaded for a specific Canvas course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the Canvas course.",
        },
        search_term: {
          type: "string",
          description: "Optional. Filter results to files matching this filename search term.",
        },
      },
      required: ["course_id"],
    },
  },
];

const handlers = {
  list_files: async (client, args) => {
    const courseId = args.course_id;
    if (!courseId) {
      throw new Error("Missing required argument: course_id");
    }
    const params = {};
    if (args.search_term) {
      params.search_term = args.search_term;
    }
    const response = await client.get(`/api/v1/courses/${courseId}/files`, { params });
    const files = Array.isArray(response.data) ? response.data : [];
    return files.map(f => ({
      id: f.id,
      folder_id: f.folder_id,
      display_name: f.display_name,
      filename: f.filename,
      content_type: f.content_type,
      url: f.url,
      size: f.size,
      created_at: f.created_at,
    }));
  },
};

module.exports = {
  definitions,
  handlers,
};

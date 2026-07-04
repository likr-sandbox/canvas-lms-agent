const definitions = [
  {
    name: "list_pages",
    description: "Retrieves the list of wiki pages for a specific Canvas course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the Canvas course.",
        },
      },
      required: ["course_id"],
    },
  },
  {
    name: "get_page",
    description: "Retrieves the detailed wiki page contents (HTML body) for a course page.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the Canvas course.",
        },
        url_or_id: {
          type: "string",
          description: "The URL key or unique ID of the page.",
        },
      },
      required: ["course_id", "url_or_id"],
    },
  },
];

const handlers = {
  list_pages: async (client, args) => {
    const courseId = args.course_id;
    if (!courseId) {
      throw new Error("Missing required argument: course_id");
    }
    const response = await client.get(`/api/v1/courses/${courseId}/pages`);
    const pages = Array.isArray(response.data) ? response.data : [];
    return pages.map(p => ({
      page_id: p.page_id,
      url: p.url,
      title: p.title,
      updated_at: p.updated_at,
      published: p.published,
      front_page: p.front_page,
    }));
  },

  get_page: async (client, args) => {
    const courseId = args.course_id;
    const urlOrId = args.url_or_id;
    if (!courseId || !urlOrId) {
      throw new Error("Missing required arguments: course_id, url_or_id");
    }
    const response = await client.get(`/api/v1/courses/${courseId}/pages/${urlOrId}`);
    const p = response.data || {};
    return {
      page_id: p.page_id,
      url: p.url,
      title: p.title,
      body: p.body,
      updated_at: p.updated_at,
      published: p.published,
    };
  },
};

module.exports = {
  definitions,
  handlers,
};

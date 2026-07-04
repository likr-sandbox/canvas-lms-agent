const definitions = [
  {
    name: "list_sections",
    description: "Retrieves the list of sections in a Canvas course.",
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
];

const handlers = {
  list_sections: async (client, args) => {
    const courseId = args.course_id;
    if (!courseId) {
      throw new Error("Missing required argument: course_id");
    }
    const response = await client.get(`/api/v1/courses/${courseId}/sections`);
    const sections = Array.isArray(response.data) ? response.data : [];
    return sections.map(s => ({
      id: s.id,
      name: s.name,
      course_id: s.course_id,
      sis_section_id: s.sis_section_id,
    }));
  },
};

module.exports = {
  definitions,
  handlers,
};

const definitions = [
  {
    name: "list_rubrics",
    description: "Retrieves the list of rubrics associated with a specific Canvas course.",
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
  list_rubrics: async (client, args) => {
    const courseId = args.course_id;
    if (!courseId) {
      throw new Error("Missing required argument: course_id");
    }
    const response = await client.get(`/api/v1/courses/${courseId}/rubrics`);
    const rubrics = Array.isArray(response.data) ? response.data : [];
    return rubrics.map(r => ({
      id: r.id,
      title: r.title,
      context_id: r.context_id,
      context_type: r.context_type,
      points_possible: r.points_possible,
      reusable: r.reusable,
      public: r.public,
      read_only: r.read_only,
    }));
  },
};

module.exports = {
  definitions,
  handlers,
};

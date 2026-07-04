const definitions = [
  {
    name: "list_quizzes",
    description: "Retrieves the list of quizzes for a specific Canvas course.",
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
  list_quizzes: async (client, args) => {
    const courseId = args.course_id;
    if (!courseId) {
      throw new Error("Missing required argument: course_id");
    }
    const response = await client.get(`/api/v1/courses/${courseId}/quizzes`);
    const quizzes = Array.isArray(response.data) ? response.data : [];
    return quizzes.map(q => ({
      id: q.id,
      title: q.title,
      points_possible: q.points_possible,
      question_count: q.question_count,
      time_limit: q.time_limit,
      due_at: q.due_at,
      published: q.published,
    }));
  },
};

module.exports = {
  definitions,
  handlers,
};

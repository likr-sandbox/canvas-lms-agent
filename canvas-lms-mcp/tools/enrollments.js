const definitions = [
  {
    name: "list_enrollments",
    description: "Retrieves the list of enrollments in a Canvas course, useful for inspecting user roles.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the Canvas course.",
        },
        type: {
          type: "string",
          description: "Optional. Filter enrollments by type (e.g. 'StudentEnrollment', 'TeacherEnrollment').",
        },
      },
      required: ["course_id"],
    },
  },
];

const handlers = {
  list_enrollments: async (client, args) => {
    const courseId = args.course_id;
    if (!courseId) {
      throw new Error("Missing required argument: course_id");
    }
    const params = {};
    if (args.type) {
      params["type[]"] = [args.type];
    }
    const response = await client.get(`/api/v1/courses/${courseId}/enrollments`, { params });
    const enrollments = Array.isArray(response.data) ? response.data : [];
    return enrollments.map(e => ({
      id: e.id,
      user_id: e.user_id,
      course_id: e.course_id,
      type: e.type,
      role: e.role,
      role_id: e.role_id,
      enrollment_state: e.enrollment_state,
      user: e.user ? { id: e.user.id, name: e.user.name, short_name: e.user.short_name } : null,
    }));
  },
};

module.exports = {
  definitions,
  handlers,
};

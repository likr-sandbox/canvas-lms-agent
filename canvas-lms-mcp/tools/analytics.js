const definitions = [
  {
    name: "get_department_participation_data",
    description: "Returns page view hits summed across all courses in the department.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account."
        },
        term: {
          type: "string",
          description: "The subset of courses to include. Can be 'current', 'completed', or a term ID. Defaults to 'current'."
        }
      },
      required: ["account_id"]
    }
  },
  {
    name: "get_department_grade_data",
    description: "Returns the distribution of grades for students in courses in the department.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account."
        },
        term: {
          type: "string",
          description: "The subset of courses to include. Can be 'current', 'completed', or a term ID. Defaults to 'current'."
        }
      },
      required: ["account_id"]
    }
  },
  {
    name: "get_course_participation_data",
    description: "Returns page view hits and participation numbers grouped by day for the course.",
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
    name: "get_course_grade_data",
    description: "Returns the distribution of grades for students in the course.",
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
    name: "get_course_student_summaries",
    description: "Returns a summary of student participation and grades in the course.",
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
    name: "get_user_participation_data",
    description: "Returns page view hits and participation numbers grouped by day for a student in a course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        student_id: {
          type: "number",
          description: "The unique ID of the student."
        }
      },
      required: ["course_id", "student_id"]
    }
  },
  {
    name: "get_user_assignment_data",
    description: "Returns assignment information and student grade details for a student in a course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        student_id: {
          type: "number",
          description: "The unique ID of the student."
        }
      },
      required: ["course_id", "student_id"]
    }
  }
];

const handlers = {
  get_department_participation_data: async (client, args) => {
    const { account_id, term = "current" } = args;
    const termPath = term === "current" || term === "completed" ? term : `terms/${term}`;
    const response = await client.get(`/api/v1/accounts/${account_id}/analytics/${termPath}/activity`);
    return response.data;
  },

  get_department_grade_data: async (client, args) => {
    const { account_id, term = "current" } = args;
    const termPath = term === "current" || term === "completed" ? term : `terms/${term}`;
    const response = await client.get(`/api/v1/accounts/${account_id}/analytics/${termPath}/grades`);
    return response.data;
  },

  get_course_participation_data: async (client, args) => {
    const { course_id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/analytics/activity`);
    return response.data;
  },

  get_course_grade_data: async (client, args) => {
    const { course_id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/analytics/grades`);
    return response.data;
  },

  get_course_student_summaries: async (client, args) => {
    const { course_id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/analytics/users`);
    return response.data;
  },

  get_user_participation_data: async (client, args) => {
    const { course_id, student_id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/analytics/users/${student_id}/activity`);
    return response.data;
  },

  get_user_assignment_data: async (client, args) => {
    const { course_id, student_id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/analytics/users/${student_id}/assignments`);
    return response.data;
  }
};

module.exports = {
  definitions,
  handlers
};

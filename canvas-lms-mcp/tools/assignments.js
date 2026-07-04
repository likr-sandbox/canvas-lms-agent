const definitions = [
  {
    name: "list_assignments",
    description: "Retrieves the list of assignments for a specific Canvas course.",
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
    name: "submit_assignment",
    description: "Make a submission for an assignment as a student.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the Canvas course.",
        },
        assignment_id: {
          type: "number",
          description: "The unique ID of the assignment.",
        },
        submission_type: {
          type: "string",
          description: "The type of submission. Allowed values: 'online_text_entry', 'online_url'.",
        },
        body: {
          type: "string",
          description: "Optional. The text/HTML content for 'online_text_entry'.",
        },
        url: {
          type: "string",
          description: "Optional. The URL for 'online_url'.",
        },
        text_comment: {
          type: "string",
          description: "Optional. Add a textual comment with the submission.",
        },
      },
      required: ["course_id", "assignment_id", "submission_type"],
    },
  },
];

const handlers = {
  list_assignments: async (client, args) => {
    const courseId = args.course_id;
    if (!courseId) {
      throw new Error("Missing required argument: course_id");
    }
    const response = await client.get(`/api/v1/courses/${courseId}/assignments`);
    const assignments = Array.isArray(response.data) ? response.data : [];
    return assignments.map(asm => ({
      id: asm.id,
      name: asm.name,
      points_possible: asm.points_possible,
      due_at: asm.due_at,
      has_submitted_submissions: asm.has_submitted_submissions,
    }));
  },

  submit_assignment: async (client, args) => {
    const { course_id: courseId, assignment_id: assignmentId, submission_type: submissionType, body, url, text_comment: textComment } = args;
    if (!courseId || !assignmentId || !submissionType) {
      throw new Error("Missing required arguments: course_id, assignment_id, submission_type");
    }
    
    const payload = {
      submission: {
        submission_type: submissionType
      }
    };
    if (body !== undefined) payload.submission.body = body;
    if (url !== undefined) payload.submission.url = url;
    if (textComment !== undefined) {
      payload.comment = { text_comment: textComment };
    }
    
    const response = await client.post(
      `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions`,
      payload
    );
    
    const sub = response.data || {};
    return {
      id: sub.id,
      assignment_id: sub.assignment_id,
      user_id: sub.user_id,
      submission_type: sub.submission_type,
      submitted_at: sub.submitted_at,
      url: sub.url,
    };
  },
};

module.exports = {
  definitions,
  handlers,
};

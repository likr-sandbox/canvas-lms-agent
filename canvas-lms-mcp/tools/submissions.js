const definitions = [
  {
    name: "get_user_grades",
    description: "Retrieves grading and submission details for assignments. If teacher/TA/staff, automatically queries all students (or pass student_id to specify). If student, retrieves caller's grades.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the Canvas course.",
        },
        student_id: {
          type: "number",
          description: "Optional (for Teacher/TA/Staff). The specific student ID to fetch grades for.",
        },
      },
      required: ["course_id"],
    },
  },
  {
    name: "grade_or_comment_submission",
    description: "Comment on and/or update the grade for a student's assignment submission.",
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
        user_id: {
          type: "number",
          description: "The Canvas user ID of the student.",
        },
        posted_grade: {
          type: "string",
          description: "Optional. Assign a score/grade (e.g. '15', '85%', 'A-').",
        },
        text_comment: {
          type: "string",
          description: "Optional. Add a feedback text comment.",
        },
      },
      required: ["course_id", "assignment_id", "user_id"],
    },
  },
];

const handlers = {
  get_user_grades: async (client, args) => {
    const courseId = args.course_id;
    if (!courseId) {
      throw new Error("Missing required argument: course_id");
    }
    
    // Fetch course details with enrollments to check the user's role
    const courseResponse = await client.get(`/api/v1/courses/${courseId}`, {
      params: { "include[]": ["enrollments"] }
    });
    const enrollments = courseResponse.data.enrollments || [];
    const isTeacherOrStaff = enrollments.some(e => 
      e.type === "teacher" || e.type === "ta" || e.type === "designer" || e.type === "observer"
    );
    
    const params = {
      "include[]": ["assignment"]
    };
    
    if (args.student_id) {
      params["student_ids[]"] = [args.student_id];
    } else if (isTeacherOrStaff) {
      params["student_ids[]"] = ["all"];
    }
    
    const response = await client.get(`/api/v1/courses/${courseId}/students/submissions`, {
      params: params
    });
    
    const submissions = Array.isArray(response.data) ? response.data : [];
    return submissions.map(sub => {
      const asm = sub.assignment || {};
      return {
        assignment_id: sub.assignment_id,
        user_id: sub.user_id,
        assignment_name: asm.name || "N/A",
        points_possible: asm.points_possible,
        score: sub.score !== null ? sub.score : "Not Graded",
        grade: sub.grade !== null ? sub.grade : "N/A",
        submitted_at: sub.submitted_at,
        graded_at: sub.graded_at,
        excused: sub.excused,
      };
    });
  },

  grade_or_comment_submission: async (client, args) => {
    const { course_id: courseId, assignment_id: assignmentId, user_id: userId, posted_grade: postedGrade, text_comment: textComment } = args;
    if (!courseId || !assignmentId || !userId) {
      throw new Error("Missing required arguments: course_id, assignment_id, user_id");
    }
    
    const payload = {};
    if (postedGrade !== undefined) {
      payload.submission = { posted_grade: postedGrade };
    }
    if (textComment !== undefined) {
      payload.comment = { text_comment: textComment };
    }
    
    const response = await client.put(
      `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}`,
      payload
    );
    
    const sub = response.data || {};
    return {
      assignment_id: sub.assignment_id,
      user_id: sub.user_id,
      grade: sub.grade,
      score: sub.score,
      graded_at: sub.graded_at,
    };
  },
};

module.exports = {
  definitions,
  handlers,
};

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");
const axios = require("axios");

// Initialize server
const server = new Server(
  {
    name: "canvas-lms-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Get environment configurations
const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL || "https://canvas.instructure.com";
const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;

// Helper to create Canvas Axios client
function getCanvasClient() {
  if (!CANVAS_API_TOKEN) {
    throw new Error("CANVAS_API_TOKEN environment variable is not configured.");
  }
  return axios.create({
    baseURL: CANVAS_BASE_URL.replace(/\/$/, ""),
    headers: {
      Authorization: `Bearer ${CANVAS_API_TOKEN}`,
      Accept: "application/json",
    },
  });
}

// Define tools list
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_current_user",
        description: "Retrieves details about the authenticated Canvas user to verify credentials.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "list_courses",
        description: "Retrieves the list of active courses for the authenticated user.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
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
        name: "get_user_grades",
        description: "Retrieves submission and grading details for assignments in a specific course. Can query self or a specific student.",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "number",
              description: "The unique ID of the Canvas course.",
            },
            student_id: {
              type: "number",
              description: "Optional. The student ID to get grades for. If omitted, retrieves grades for the logged-in user ('self').",
            },
          },
          required: ["course_id"],
        },
      },
      {
        name: "list_modules",
        description: "Retrieves the list of modules for a specific Canvas course.",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "number",
              description: "The unique ID of the Canvas course.",
            },
            include_items: {
              type: "boolean",
              description: "Optional. Whether to return module items inline. Defaults to false.",
            },
          },
          required: ["course_id"],
        },
      },
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
              description: "Optional. Filter results by partial file name match.",
            },
          },
          required: ["course_id"],
        },
      },
      {
        name: "list_discussion_topics",
        description: "Retrieves the list of discussion topics for a specific Canvas course.",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "number",
              description: "The unique ID of the Canvas course.",
            },
            search_term: {
              type: "string",
              description: "Optional. Filter results by partial topic title match.",
            },
          },
          required: ["course_id"],
        },
      },
      {
        name: "list_announcements",
        description: "Retrieves the list of announcements for a specific Canvas course.",
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
        name: "list_pages",
        description: "Retrieves the list of pages (wikis) for a specific Canvas course.",
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
        description: "Retrieves details of a specific page (wiki) including its body content in a Canvas course.",
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
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const client = getCanvasClient();

    if (name === "get_current_user") {
      const response = await client.get("/api/v1/users/self");
      const user = response.data;
      const result = {
        id: user.id,
        name: user.name,
        short_name: user.short_name,
        primary_email: user.primary_email || user.email || "N/A",
        login_id: user.login_id,
        time_zone: user.time_zone,
      };
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } 
    
    else if (name === "list_courses") {
      const response = await client.get("/api/v1/courses", {
        params: { enrollment_state: "active" }
      });
      const courses = Array.isArray(response.data) ? response.data : [];
      const result = courses.map(course => ({
        id: course.id,
        name: course.name || course.course_code,
        course_code: course.course_code,
        start_at: course.start_at,
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } 
    
    else if (name === "list_assignments") {
      const courseId = args.course_id;
      if (!courseId) {
        throw new Error("Missing required argument: course_id");
      }
      const response = await client.get(`/api/v1/courses/${courseId}/assignments`);
      const assignments = Array.isArray(response.data) ? response.data : [];
      const result = assignments.map(asm => ({
        id: asm.id,
        name: asm.name,
        points_possible: asm.points_possible,
        due_at: asm.due_at,
        has_submitted_submissions: asm.has_submitted_submissions,
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } 
    
    else if (name === "get_user_grades") {
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
        // Teachers / TA / staff default to retrieving submissions for all students
        params["student_ids[]"] = ["all"];
      }
      
      const response = await client.get(`/api/v1/courses/${courseId}/students/submissions`, {
        params: params
      });
      
      const submissions = Array.isArray(response.data) ? response.data : [];
      const result = submissions.map(sub => {
        const asm = sub.assignment || {};
        return {
          assignment_id: sub.assignment_id,
          assignment_name: asm.name || "N/A",
          points_possible: asm.points_possible,
          score: sub.score !== null ? sub.score : "Not Graded",
          grade: sub.grade !== null ? sub.grade : "N/A",
          submitted_at: sub.submitted_at,
          graded_at: sub.graded_at,
          excused: sub.excused,
        };
      });
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } 
    
    else if (name === "list_modules") {
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
      const result = modules.map(m => {
        const itemResult = {
          id: m.id,
          name: m.name,
          workflow_state: m.workflow_state,
          position: m.position,
          items_count: m.items_count,
        };
        if (Array.isArray(m.items)) {
          itemResult.items = m.items.map(item => ({
            id: item.id,
            title: item.title,
            type: item.type,
            content_id: item.content_id,
            page_url: item.page_url,
            external_url: item.external_url,
            completion_requirement: item.completion_requirement,
          }));
        }
        return itemResult;
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    else if (name === "list_files") {
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
      const result = files.map(f => ({
        id: f.id,
        folder_id: f.folder_id,
        display_name: f.display_name,
        filename: f.filename,
        "content-type": f["content-type"],
        url: f.url,
        size: f.size,
        created_at: f.created_at,
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    else if (name === "list_discussion_topics") {
      const courseId = args.course_id;
      if (!courseId) {
        throw new Error("Missing required argument: course_id");
      }
      const params = {};
      if (args.search_term) {
        params.search_term = args.search_term;
      }
      const response = await client.get(`/api/v1/courses/${courseId}/discussion_topics`, { params });
      const topics = Array.isArray(response.data) ? response.data : [];
      const result = topics.map(t => ({
        id: t.id,
        title: t.title,
        message: t.message,
        posted_at: t.posted_at,
        user_name: t.user_name,
        last_reply_at: t.last_reply_at,
        locked: t.locked,
        pinned: t.pinned,
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    else if (name === "list_announcements") {
      const courseId = args.course_id;
      if (!courseId) {
        throw new Error("Missing required argument: course_id");
      }
      const response = await client.get(`/api/v1/courses/${courseId}/discussion_topics`, {
        params: { only_announcements: true }
      });
      const announcements = Array.isArray(response.data) ? response.data : [];
      const result = announcements.map(a => ({
        id: a.id,
        title: a.title,
        message: a.message,
        posted_at: a.posted_at,
        user_name: a.user_name,
        last_reply_at: a.last_reply_at,
        locked: a.locked,
        pinned: a.pinned,
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    else if (name === "list_pages") {
      const courseId = args.course_id;
      if (!courseId) {
        throw new Error("Missing required argument: course_id");
      }
      const response = await client.get(`/api/v1/courses/${courseId}/pages`);
      const pages = Array.isArray(response.data) ? response.data : [];
      const result = pages.map(p => ({
        page_id: p.page_id,
        url: p.url,
        title: p.title,
        updated_at: p.updated_at,
        published: p.published,
        front_page: p.front_page,
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    else if (name === "get_page") {
      const courseId = args.course_id;
      const urlOrId = args.url_or_id;
      if (!courseId || !urlOrId) {
        throw new Error("Missing required arguments: course_id, url_or_id");
      }
      const response = await client.get(`/api/v1/courses/${courseId}/pages/${urlOrId}`);
      const p = response.data || {};
      const result = {
        page_id: p.page_id,
        url: p.url,
        title: p.title,
        body: p.body,
        updated_at: p.updated_at,
        published: p.published,
      };
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    else if (name === "list_quizzes") {
      const courseId = args.course_id;
      if (!courseId) {
        throw new Error("Missing required argument: course_id");
      }
      const response = await client.get(`/api/v1/courses/${courseId}/quizzes`);
      const quizzes = Array.isArray(response.data) ? response.data : [];
      const result = quizzes.map(q => ({
        id: q.id,
        title: q.title,
        points_possible: q.points_possible,
        question_count: q.question_count,
        time_limit: q.time_limit,
        due_at: q.due_at,
        published: q.published,
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    else {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Unknown tool: ${name}`,
          },
        ],
      };
    }
  } catch (error) {
    let errorMsg = error.message;
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const data = error.response.data;
      errorMsg = `Canvas API returned status code ${status}: ${JSON.stringify(data)}`;
      if (status === 401) {
        errorMsg = "Unauthorized: Please verify that CANVAS_API_TOKEN is valid.";
      } else if (status === 404) {
        errorMsg = "Not Found: The requested endpoint was not found on Canvas.";
      }
    }
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error executing tool '${name}': ${errorMsg}`,
        },
      ],
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Canvas LMS MCP Server started successfully (stdio)");
}

main().catch((error) => {
  console.error("Fatal error starting Canvas LMS MCP Server:", error);
  process.exit(1);
});

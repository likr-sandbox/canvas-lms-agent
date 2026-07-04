---
name: canvas-lms
description: Use this skill when managing any Canvas LMS tasks, including checking course list, retrieving assignment details, submitting assignments, checking/grading submissions, creating modules, managing discussions, or any operations using the Canvas LMS MCP server. Always consult this skill when the user asks to interact with Canvas LMS APIs.
---

# Canvas LMS Skill Guide

This skill guide provides the entry point for utilizing the Canvas LMS MCP Server tools to interact with Canvas APIs.

## Setup / Initialization

Before executing any Canvas LMS tasks, start and connect to the MCP server using the following command:

```bash
npm --silent --prefix canvas-lms-mcp start
```

> [!IMPORTANT]
> Always run with the `--silent` flag. If `--silent` is omitted, `npm` writes startup banners to stdout, which corrupts the stdio JSON-RPC protocol stream and causes the agent connection to fail.

Make sure the following environment variables are supplied:
- `CANVAS_API_TOKEN`: The API access token generated from Canvas User Settings.
- `CANVAS_BASE_URL`: The URL of your Canvas instance (e.g. `https://nu.instructure.com/`).

---

## Tool Configuration & Pagination Guidelines

### Dynamic Tool Execution
The `canvas-lms` skill no longer uses direct endpoint tools (like `GET /api/v1/courses`). Instead, it provides two primary dynamic tools:
1. `search_canvas_api`: Use this to look up the exact HTTP method and API path based on keywords (e.g., query="courses").
2. `call_canvas_api`: Use this to execute the API call, supplying the `method`, `path`, `query_params`, and `body_params`.

**Note:** The detailed guides (e.g., `student_guide.md`, `teacher_guide.md`) document the REST API endpoints and methods (e.g., "Use `GET /api/v1/courses`"). When you see these, you must call them using the `call_canvas_api` tool. If an endpoint isn't listed or you are unsure, use `search_canvas_api` to look it up.

### Pagination
Canvas API pagination must be handled manually by the agent. The `call_canvas_api` tool does NOT automatically fetch all pages.
- When you expect multiple results, provide `page` and `per_page` within `query_params` (e.g., `query_params: { page: 1, per_page: 50 }`).
- If the length of the array returned by `call_canvas_api` is equal to your `per_page` value, assume there is a next page. Increment `page` and fetch again if you need more records.

---

## Task Delegation by Role (Progressive Disclosure)

Depending on the role of the user (e.g., student vs. teacher/staff) and the objective of the request, you must navigate to the appropriate role guide below:

### 1. Student Role tasks
If the user is a student or the task involves student-specific operations (e.g., submitting assignments, taking quizzes, checking personal grades and feedback):
- **Go to**: [student_guide.md](file:///home/likr/work/likr/canvas-lms-agent/.agents/skills/canvas-lms/references/roles/student_guide.md)

### 2. Teacher / Staff / Admin Role tasks
If the user is a teacher, TA, or administrator, or the task involves managing course structures, grading, creating assignments/quizzes, generating reports, or system administration:
- **Go to**: [teacher_guide.md](file:///home/likr/work/likr/canvas-lms-agent/.agents/skills/canvas-lms/references/roles/teacher_guide.md)

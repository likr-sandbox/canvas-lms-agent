---
name: canvas-lms
description: Use this skill when managing Canvas LMS tasks, such as checking course list, retrieving assignment details, or checking grades and submissions for users.
---

# Canvas LMS Skill Guide

This skill manual guides the agent in using the Canvas LMS MCP Server tools to interact with Canvas APIs.

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

## Workflow & Guidelines

When a Canvas LMS task is requested, perform operations in the following logical sequence:

1. **Verify User / Connection**:
   - Call `get_current_user` to test credentials and connectivity, ensuring that the token is valid and checking the current user's profile.

2. **Retrieve Courses**:
   - Call `list_courses` to obtain the list of active courses, noting their corresponding course IDs.

3. **Explore Course Content & Structured Flow**:
   - **Announcements**: Call `list_announcements` to read recent updates or bulletins for the course.
   - **Modules**: Call `list_modules` with `include_items: true` to get a structured view of the course syllabus, content modules, and items (like pages, quizzes, files, and assignments) in the correct learning sequence.
   - **Wiki Pages**: Call `list_pages` to list course pages. If you need details of a page (e.g. syllabus details, reading materials), call `get_page` using the page URL or ID.
   - **Uploaded Files**: Call `list_files` to locate PDFs, slides, or other course documents. Search by term if you are looking for a specific filename.
   - **Quizzes**: Call `list_quizzes` to check for available online quizzes or surveys.

4. **Retrieve Assignments**:
   - For a given course ID, call `list_assignments` to fetch the list of assignments, noting assignment IDs and points possible.

5. **Retrieve Grades / Submissions**:
   - Call `get_user_grades` for the course ID.
   - **Role-Based Behavior**:
     - **For Teachers / TA / Staff**: If the user is enrolled as a teacher/staff in the course, the tool will automatically return submissions for **all** students in the course. You can check a specific student's grades by passing their `student_id` in arguments.
     - **For Students**: Omit the `student_id` argument to retrieve the calling student's own grades/submissions.

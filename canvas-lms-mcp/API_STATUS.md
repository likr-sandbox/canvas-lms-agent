# Canvas LMS MCP Server - API Implementation Status

This document tracks the implementation and test status of all Model Context Protocol (MCP) tools supported by `canvas-lms-mcp`.

| # | Tool Name | Description | API Endpoint | Category | Code Location | Unit Test Status | Live Verify Status |
|---|---|---|---|---|---|---|---|
| 1 | `get_current_user` | Get profile details of calling user | `GET /api/v1/users/self` | Users / Authentication | `tools/courses.js` | `[x]` Done | `[x]` Verified |
| 2 | `list_courses` | List active courses for current user | `GET /api/v1/courses` | Courses | `tools/courses.js` | `[x]` Done | `[x]` Verified |
| 3 | `list_assignments` | List assignments in a course | `GET /api/v1/courses/:id/assignments` | Assignments | `tools/assignments.js` | `[x]` Done | `[x]` Verified |
| 4 | `submit_assignment` | Submit a text/URL assignment | `POST /api/v1/courses/:id/assignments/:id/submissions` | Assignments | `tools/assignments.js` | `[x]` Done | `[x]` Verified |
| 5 | `get_user_grades` | Get submissions & grade details in a course | `GET /api/v1/courses/:id/students/submissions` | Submissions | `tools/submissions.js` | `[x]` Done | `[x]` Verified |
| 6 | `grade_or_comment_submission` | Update score/feedback on a student submission | `PUT /api/v1/courses/:id/assignments/:id/submissions/:user_id` | Submissions | `tools/submissions.js` | `[x]` Done | `[x]` Verified |
| 7 | `list_modules` | List course modules and inlined items | `GET /api/v1/courses/:id/modules` | Modules | `tools/modules.js` | `[x]` Done | `[x]` Verified |
| 8 | `list_files` | List files uploaded to a course | `GET /api/v1/courses/:id/files` | Files | `tools/files.js` | `[x]` Done | `[x]` Verified |
| 9 | `list_discussion_topics` | List discussion topics in a course | `GET /api/v1/courses/:id/discussion_topics` | Discussions | `tools/discussions.js` | `[x]` Done | `[x]` Verified |
| 10 | `list_announcements` | List announcements (discussion topics with only_announcements=true) | `GET /api/v1/courses/:id/discussion_topics` | Discussions | `tools/discussions.js` | `[x]` Done | `[x]` Verified |
| 11 | `list_pages` | List wiki pages in a course | `GET /api/v1/courses/:id/pages` | Pages | `tools/pages.js` | `[x]` Done | `[x]` Verified |
| 12 | `get_page` | Get detailed content (HTML body) of a page | `GET /api/v1/courses/:id/pages/:url_or_id` | Pages | `tools/pages.js` | `[x]` Done | `[x]` Verified |
| 13 | `list_quizzes` | List quizzes in a course | `GET /api/v1/courses/:id/quizzes` | Quizzes | `tools/quizzes.js` | `[x]` Done | `[x]` Verified |
| 14 | `list_users` | List/search users/students enrolled in a course | `GET /api/v1/courses/:id/users` | Users | `tools/users.js` | `[x]` Done | `[x]` Verified |
| 15 | `list_sections` | List sections in a course | `GET /api/v1/courses/:id/sections` | Sections | `tools/sections.js` | `[x]` Done | `[x]` Verified |
| 16 | `list_enrollments` | List enrollments and inspect roles in a course | `GET /api/v1/courses/:id/enrollments` | Enrollments | `tools/enrollments.js` | `[x]` Done | `[x]` Verified |
| 17 | `list_calendar_events` | List calendar events for courses or users | `GET /api/v1/calendar_events` | Calendar | `tools/calendar.js` | `[x]` Done | `[x]` Verified |
| 18 | `list_rubrics` | List rubrics associated with a course | `GET /api/v1/courses/:id/rubrics` | Rubrics | `tools/rubrics.js` | `[x]` Done | `[x]` Verified |

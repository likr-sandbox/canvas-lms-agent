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
| 19 | `get_course` | Get details of a specific course | `GET /api/v1/courses/:id` | Courses | `tools/courses.js` | `[x]` Done | `[x]` Verified |
| 20 | `get_assignment` | Retrieves details of a specific assignment | `GET /api/v1/courses/:course_id/assignments/:id` | Assignments | `tools/assignments.js` | `[x]` Done | `[x]` Verified |
| 21 | `create_assignment` | Creates a new assignment for a course | `POST /api/v1/courses/:course_id/assignments` | Assignments | `tools/assignments.js` | `[x]` Done | `[x]` Verified |
| 22 | `update_assignment` | Updates an existing assignment | `PUT /api/v1/courses/:course_id/assignments/:id` | Assignments | `tools/assignments.js` | `[x]` Done | `[x]` Verified |
| 23 | `delete_assignment` | Deletes an assignment | `DELETE /api/v1/courses/:course_id/assignments/:id` | Assignments | `tools/assignments.js` | `[x]` Done | `[x]` Verified |
| 24 | `get_submission` | Retrieves a single student's submission details | `GET /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id` | Submissions | `tools/submissions.js` | `[x]` Done | `[x]` Verified |
| 25 | `get_module` | Retrieves details of a specific module | `GET /api/v1/courses/:course_id/modules/:id` | Modules | `tools/modules.js` | `[x]` Done | `[x]` Verified |
| 26 | `create_module` | Creates a new module for a course | `POST /api/v1/courses/:course_id/modules` | Modules | `tools/modules.js` | `[x]` Done | `[x]` Verified |
| 27 | `update_module` | Updates an existing module | `PUT /api/v1/courses/:course_id/modules/:id` | Modules | `tools/modules.js` | `[x]` Done | `[x]` Verified |
| 28 | `delete_module` | Deletes a module | `DELETE /api/v1/courses/:course_id/modules/:id` | Modules | `tools/modules.js` | `[x]` Done | `[x]` Verified |
| 29 | `create_page` | Creates a new wiki page | `POST /api/v1/courses/:course_id/pages` | Pages | `tools/pages.js` | `[x]` Done | `[x]` Verified |
| 30 | `update_page` | Updates an existing wiki page | `PUT /api/v1/courses/:course_id/pages/:url_or_id` | Pages | `tools/pages.js` | `[x]` Done | `[x]` Verified |
| 31 | `delete_page` | Deletes a wiki page | `DELETE /api/v1/courses/:course_id/pages/:url_or_id` | Pages | `tools/pages.js` | `[x]` Done | `[x]` Verified |
| 32 | `get_quiz` | Retrieves details of a specific quiz | `GET /api/v1/courses/:course_id/quizzes/:id` | Quizzes | `tools/quizzes.js` | `[x]` Done | `[x]` Verified |
| 33 | `create_quiz` | Creates a new quiz for a course | `POST /api/v1/courses/:course_id/quizzes` | Quizzes | `tools/quizzes.js` | `[x]` Done | `[x]` Verified |
| 34 | `update_quiz` | Updates an existing quiz | `PUT /api/v1/courses/:course_id/quizzes/:id` | Quizzes | `tools/quizzes.js` | `[x]` Done | `[x]` Verified |
| 35 | `delete_quiz` | Deletes a quiz | `DELETE /api/v1/courses/:course_id/quizzes/:id` | Quizzes | `tools/quizzes.js` | `[x]` Done | `[x]` Verified |
| 36 | `create_discussion_topic` | Creates a new discussion topic or announcement | `POST /api/v1/courses/:course_id/discussion_topics` | Discussions | `tools/discussions.js` | `[x]` Done | `[x]` Verified |
| 37 | `list_accounts` | Lists accessible accounts | `GET /api/v1/accounts` | Accounts | `tools/accounts.js` | `[x]` Done | `[ ]` N/A |
| 38 | `get_account` | Gets details for a specific account | `GET /api/v1/accounts/:id` | Accounts | `tools/accounts.js` | `[x]` Done | `[ ]` N/A |
| 39 | `list_admins` | Lists account administrators | `GET /api/v1/accounts/:account_id/admins` | Accounts | `tools/accounts.js` | `[x]` Done | `[ ]` N/A |
| 40 | `add_admin` | Promotes a user to admin | `POST /api/v1/accounts/:account_id/admins` | Accounts | `tools/accounts.js` | `[x]` Done | `[ ]` N/A |
| 41 | `remove_admin` | Demotes an administrator | `DELETE /api/v1/accounts/:account_id/admins/:user_id` | Accounts | `tools/accounts.js` | `[x]` Done | `[ ]` N/A |
| 42 | `list_roles` | Lists roles available to an account | `GET /api/v1/accounts/:account_id/roles` | Accounts | `tools/accounts.js` | `[x]` Done | `[ ]` N/A |
| 43 | `get_role` | Gets specific role details | `GET /api/v1/accounts/:account_id/roles/:id` | Accounts | `tools/accounts.js` | `[x]` Done | `[ ]` N/A |
| 44 | `list_conversations` | Lists inbox conversations | `GET /api/v1/conversations` | Conversations | `tools/conversations.js` | `[x]` Done | `[ ]` N/A |
| 45 | `get_conversation` | Gets specific conversation details | `GET /api/v1/conversations/:id` | Conversations | `tools/conversations.js` | `[x]` Done | `[ ]` N/A |
| 46 | `create_conversation` | Sends a message to recipients | `POST /api/v1/conversations` | Conversations | `tools/conversations.js` | `[x]` Done | `[ ]` N/A |
| 47 | `delete_conversation` | Deletes a conversation | `DELETE /api/v1/conversations/:id` | Conversations | `tools/conversations.js` | `[x]` Done | `[ ]` N/A |
| 48 | `list_communication_channels` | Lists user contact channels | `GET /api/v1/users/:user_id/communication_channels` | Conversations | `tools/conversations.js` | `[x]` Done | `[ ]` N/A |
| 49 | `list_groups` | Lists groups in a course | `GET /api/v1/courses/:course_id/groups` | Groups | `tools/groups.js` | `[x]` Done | `[ ]` N/A |
| 50 | `get_group` | Gets specific group details | `GET /api/v1/groups/:id` | Groups | `tools/groups.js` | `[x]` Done | `[ ]` N/A |
| 51 | `create_group` | Creates a group for a course | `POST /api/v1/courses/:course_id/groups` | Groups | `tools/groups.js` | `[x]` Done | `[ ]` N/A |
| 52 | `delete_group` | Deletes a group | `DELETE /api/v1/groups/:id` | Groups | `tools/groups.js` | `[x]` Done | `[ ]` N/A |
| 53 | `list_group_categories` | Lists group categories | `GET /api/v1/courses/:course_id/group_categories` | Groups | `tools/groups.js` | `[x]` Done | `[ ]` N/A |
| 54 | `get_group_category` | Gets group category details | `GET /api/v1/group_categories/:id` | Groups | `tools/groups.js` | `[x]` Done | `[ ]` N/A |
| 55 | `create_group_category` | Creates a group category | `POST /api/v1/courses/:course_id/group_categories` | Groups | `tools/groups.js` | `[x]` Done | `[ ]` N/A |
| 56 | `delete_group_category` | Deletes a group category | `DELETE /api/v1/group_categories/:id` | Groups | `tools/groups.js` | `[x]` Done | `[ ]` N/A |
| 57 | `list_collaborations` | Lists course collaborations | `GET /api/v1/courses/:course_id/collaborations` | Groups | `tools/groups.js` | `[x]` Done | `[ ]` N/A |
| 58 | `get_outcome` | Gets learning outcome details | `GET /api/v1/outcomes/:id` | Outcomes | `tools/outcomes.js` | `[x]` Done | `[ ]` N/A |
| 59 | `update_outcome` | Updates learning outcome settings | `PUT /api/v1/outcomes/:id` | Outcomes | `tools/outcomes.js` | `[x]` Done | `[ ]` N/A |
| 60 | `list_outcome_groups` | Lists outcome groups | `GET /api/v1/courses/:course_id/outcome_groups` | Outcomes | `tools/outcomes.js` | `[x]` Done | `[ ]` N/A |
| 61 | `get_outcome_group` | Gets outcome group details | `GET /api/v1/courses/:course_id/outcome_groups/:id` | Outcomes | `tools/outcomes.js` | `[x]` Done | `[ ]` N/A |
| 62 | `list_outcome_results` | Lists alignment assessment results | `GET /api/v1/courses/:course_id/outcome_results` | Outcomes | `tools/outcomes.js` | `[x]` Done | `[ ]` N/A |
| 63 | `list_outcome_rollups` | Lists outcome rollups | `GET /api/v1/courses/:course_id/outcome_rollups` | Outcomes | `tools/outcomes.js` | `[x]` Done | `[ ]` N/A |
| 64 | `get_sis_import` | Retrieves status of a SIS import | `GET /api/v1/accounts/:account_id/sis_imports/:id` | Integrations | `tools/integrations.js` | `[x]` Done | `[ ]` N/A |
| 65 | `create_sis_import` | Starts a SIS import | `POST /api/v1/accounts/:account_id/sis_imports` | Integrations | `tools/integrations.js` | `[x]` Done | `[ ]` N/A |
| 66 | `list_sis_assignments` | Lists SIS-enabled assignments | `GET /api/sis/courses/:course_id/assignments` | Integrations | `tools/integrations.js` | `[x]` Done | `[ ]` N/A |
| 67 | `list_external_tools` | Lists LTI external tools | `GET /api/v1/courses/:course_id/external_tools` | Integrations | `tools/integrations.js` | `[x]` Done | `[ ]` N/A |
| 68 | `get_external_tool` | Gets external tool details | `GET /api/v1/courses/:course_id/external_tools/:id` | Integrations | `tools/integrations.js` | `[x]` Done | `[ ]` N/A |
| 69 | `create_external_tool` | Installs an LTI tool | `POST /api/v1/courses/:course_id/external_tools` | Integrations | `tools/integrations.js` | `[x]` Done | `[ ]` N/A |
| 70 | `delete_external_tool` | Deletes an LTI tool | `DELETE /api/v1/courses/:course_id/external_tools/:id` | Integrations | `tools/integrations.js` | `[x]` Done | `[ ]` N/A |
| 71 | `list_lti_registrations` | Lists developer LTI registrations | `GET /api/v1/accounts/:account_id/lti_registrations` | Integrations | `tools/integrations.js` | `[x]` Done | `[ ]` N/A |
| 72 | `list_custom_gradebook_columns` | Lists custom gradebook columns | `GET /api/v1/courses/:course_id/custom_gradebook_columns` | Integrations | `tools/integrations.js` | `[x]` Done | `[ ]` N/A |
| 73 | `create_custom_gradebook_column` | Creates custom gradebook column | `POST /api/v1/courses/:course_id/custom_gradebook_columns` | Integrations | `tools/integrations.js` | `[x]` Done | `[ ]` N/A |
| 74 | `update_custom_gradebook_column_data` | Updates custom column data for student | `PUT /api/v1/courses/:course_id/custom_gradebook_columns/:id/data/:user_id` | Integrations | `tools/integrations.js` | `[x]` Done | `[ ]` N/A |


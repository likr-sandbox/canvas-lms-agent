# Teacher & Administrator Guide - Canvas LMS Skill

This guide outlines common tasks and workflows for **Teachers, TAs, and Administrators**. Instructors have full write privileges to build courses, manage enrollments, grade submissions, and run analytics reports.

---

## Key Workflows & Guidelines

### 1. Build and Structure Courses
To design course syllabus structure, upload files, define modules, and construct pages:
- Create and organize modules using `POST /api/v1/courses/:course_id/modules` and `PUT /api/v1/courses/:course_id/modules/:id`.
- Create lecture content or pages using `POST /api/v1/courses/:course_id/pages` and `PUT /api/v1/courses/:course_id/pages/:url_or_id`.
- Upload course materials and inspect files using `GET /api/v1/courses/:course_id/files`.
- Reference the detailed guide for Courses & Modules:
  - **See Details**: [courses_and_modules.md](file:///home/likr/work/likr/canvas-lms-agent/.agents/skills/canvas-lms/references/features/courses_and_modules.md)

### 2. Design Assignments & Quizzes
To create assessment activities, define grading parameters, and publish quizzes:
- Create assignments using `POST /api/v1/courses/:course_id/assignments` and update parameters (due dates, points, submission types) with `PUT /api/v1/courses/:course_id/assignments/:id`.
- Setup quizzes and question groups using `POST /api/v1/courses/:course_id/quizzes`, `PUT /api/v1/courses/:course_id/quizzes/:id`, or `POST /api/v1/courses/:course_id/quizzes/:quiz_id/questions`.
- Reference the detailed guide for Assignments & Quizzes:
  - **See Details**: [assignments_and_quizzes.md](file:///home/likr/work/likr/canvas-lms-agent/.agents/skills/canvas-lms/references/features/assignments_and_quizzes.md)

### 3. Evaluate Submissions & Manage Grades
To review student submissions, give scores, and provide textual feedback:
- **Retrieve All Grades**: When calling `GET /api/v1/courses/:course_id/students/submissions`, ensure you pass `student_ids[]=all` (or a specific student ID) to fetch grades for your student roster.
- **Grade & Comment**: Call `PUT /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id` with the specific student's `user_id` to post a grade or write feedback. Do not pass the teacher's own user ID.
- Check specific student files or submissions using `GET /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id`.
- Reference the detailed guide for Submissions & Grades:
  - **See Details**: [submissions_and_grades.md](file:///home/likr/work/likr/canvas-lms-agent/.agents/skills/canvas-lms/references/features/submissions_and_grades.md)

### 4. Direct Class Communications & Group Assignments
To send announcements, manage class discussions, and assign groups:
- Post announcements (which are discussion topics with `only_announcements=true` or via dedicated wrappers) using `POST /api/v1/courses/:course_id/discussion_topics`.
- Set up student project groups and categories using `POST /api/v1/groups` and `POST /api/v1/courses/:course_id/group_categories`.
- Message students individually or in groups using `POST /api/v1/conversations`.
- Reference the detailed guide for Communication & Groups:
  - **See Details**: [communication_and_groups.md](file:///home/likr/work/likr/canvas-lms-agent/.agents/skills/canvas-lms/references/features/communication_and_groups.md)

### 5. Advanced Administration, Reporting, and Analytics
To import student lists, migration data, run backups, or check page hit activity:
- Run account-wide or course-wide reports using `POST /api/v1/accounts/:account_id/reports/:report` and `POST /api/v1/courses/:course_id/reports/:report_type`.
- Import student records or section info via SIS using `POST /api/v1/accounts/:account_id/sis_imports`.
- Monitor course progress, check student activity or class grade distributions using `GET /api/v1/courses/:course_id/analytics/activity` or `GET /api/v1/courses/:course_id/analytics/assignments`.
- Manage blueprint course templates and migrations.
- Reference the detailed guide for Accounts & Admin:
  - **See Details**: [accounts_and_admin.md](file:///home/likr/work/likr/canvas-lms-agent/.agents/skills/canvas-lms/references/features/accounts_and_admin.md)

### 6. User Enrolment & Customizations
To search course rosters, manage sections, or adjust feature flags:
- Find students and retrieve their IDs using `GET /api/v1/courses/:course_id/users`.
- Check or enroll users into sections using `GET /api/v1/courses/:course_id/sections` and `GET /api/v1/courses/:course_id/enrollments`.
- Reference the detailed guide for User Settings & Customizations:
  - **See Details**: [users_and_customizations.md](file:///home/likr/work/likr/canvas-lms-agent/.agents/skills/canvas-lms/references/features/users_and_customizations.md)

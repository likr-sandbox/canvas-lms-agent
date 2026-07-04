# Teacher & Administrator Guide - Canvas LMS Skill

This guide outlines common tasks and workflows for **Teachers, TAs, and Administrators**. Instructors have full write privileges to build courses, manage enrollments, grade submissions, and run analytics reports.

---

## Key Workflows & Guidelines

### 1. Build and Structure Courses
To design course syllabus structure, upload files, define modules, and construct pages:
- Create and organize modules using `create_module` and `update_module`.
- Create lecture content or pages using `create_page` and `update_page`.
- Upload course materials and inspect files using `list_files`.
- Reference the detailed guide for Courses & Modules:
  - **See Details**: [courses_and_modules.md](file:///home/likr/src/likr-sandbox/canvas-lms-agent/.agents/skills/canvas-lms/references/features/courses_and_modules.md)

### 2. Design Assignments & Quizzes
To create assessment activities, define grading parameters, and publish quizzes:
- Create assignments using `create_assignment` and update parameters (due dates, points, submission types) with `update_assignment`.
- Setup quizzes and question groups using `create_quiz`, `update_quiz`, or `create_quiz_question`.
- Reference the detailed guide for Assignments & Quizzes:
  - **See Details**: [assignments_and_quizzes.md](file:///home/likr/src/likr-sandbox/canvas-lms-agent/.agents/skills/canvas-lms/references/features/assignments_and_quizzes.md)

### 3. Evaluate Submissions & Manage Grades
To review student submissions, give scores, and provide textual feedback:
- **Retrieve All Grades**: When calling `get_user_grades`, ensure you pass `student_ids[]=all` (or a specific student ID) to fetch grades for your student roster.
- **Grade & Comment**: Call `grade_or_comment_submission` with the specific student's `user_id` to post a grade or write feedback. Do not pass the teacher's own user ID.
- Check specific student files or submissions using `get_submission`.
- Reference the detailed guide for Submissions & Grades:
  - **See Details**: [submissions_and_grades.md](file:///home/likr/src/likr-sandbox/canvas-lms-agent/.agents/skills/canvas-lms/references/features/submissions_and_grades.md)

### 4. Direct Class Communications & Group Assignments
To send announcements, manage class discussions, and assign groups:
- Post announcements (which are discussion topics with `only_announcements=true` or via dedicated wrappers) using `create_discussion_topic`.
- Set up student project groups and categories using `create_group` and `create_group_category`.
- Message students individually or in groups using `create_conversation`.
- Reference the detailed guide for Communication & Groups:
  - **See Details**: [communication_and_groups.md](file:///home/likr/src/likr-sandbox/canvas-lms-agent/.agents/skills/canvas-lms/references/features/communication_and_groups.md)

### 5. Advanced Administration, Reporting, and Analytics
To import student lists, migration data, run backups, or check page hit activity:
- Run account-wide or course-wide reports using `start_account_report` and `start_course_report`.
- Import student records or section info via SIS using `create_sis_import`.
- Monitor course progress, check student activity or class grade distributions using `get_course_participation_data` or `get_course_grade_data`.
- Manage blueprint course templates and migrations.
- Reference the detailed guide for Accounts & Admin:
  - **See Details**: [accounts_and_admin.md](file:///home/likr/src/likr-sandbox/canvas-lms-agent/.agents/skills/canvas-lms/references/features/accounts_and_admin.md)

### 6. User Enrolment & Customizations
To search course rosters, manage sections, or adjust feature flags:
- Find students and retrieve their IDs using `list_users`.
- Check or enroll users into sections using `list_sections` and `list_enrollments`.
- Reference the detailed guide for User Settings & Customizations:
  - **See Details**: [users_and_customizations.md](file:///home/likr/src/likr-sandbox/canvas-lms-agent/.agents/skills/canvas-lms/references/features/users_and_customizations.md)

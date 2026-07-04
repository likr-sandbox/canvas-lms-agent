# Student Guide - Canvas LMS Skill

This guide outlines common tasks and workflows for **Students**. As a student, your actions are typically read-only for course structures, but include write actions for submitting assignments, replying to discussions, and managing personal settings.

---

## Key Workflows & Guidelines

### 1. View Courses, Modules, and Course Content
To browse the syllabus, download files, or check module progression:
- Use `GET /api/v1/courses` to find active course IDs.
- Use `GET /api/v1/courses/:course_id/modules` with `include_items: true` to get the structured list of modules and inline items.
- Reference the detailed guide for Courses & Modules:
  - **See Details**: [courses_and_modules.md](file:///home/likr/work/likr/canvas-lms-agent/.agents/skills/canvas-lms/references/features/courses_and_modules.md)

### 2. View Assignments & Take Quizzes
To check upcoming tasks, deadlines, and take online quizzes:
- Retrieve assignments using `GET /api/v1/courses/:course_id/assignments` or `GET /api/v1/courses/:course_id/assignments/:id`.
- Check quizzes using `GET /api/v1/courses/:course_id/quizzes` or `GET /api/v1/courses/:course_id/quizzes/:id`.
- Reference the detailed guide for Assignments & Quizzes:
  - **See Details**: [assignments_and_quizzes.md](file:///home/likr/work/likr/canvas-lms-agent/.agents/skills/canvas-lms/references/features/assignments_and_quizzes.md)

### 3. Submit Assignments & Check Grades
To submit work and view grades or instructor feedback:
- Submit assignments using `POST /api/v1/courses/:course_id/assignments/:assignment_id/submissions`.
- **Retrieve Personal Grades**: Call `GET /api/v1/courses/:course_id/students/submissions` *without* passing any `student_id`. This automatically returns the grades and submissions for the calling student.
- Reference the detailed guide for Submissions & Grades:
  - **See Details**: [submissions_and_grades.md](file:///home/likr/work/likr/canvas-lms-agent/.agents/skills/canvas-lms/references/features/submissions_and_grades.md)

### 4. Communication & Collaborative Activities
To check announcements, join discussions, or message instructors/peers:
- Read class announcements using `GET /api/v1/announcements`.
- Check or reply to discussions using `GET /api/v1/courses/:course_id/discussion_topics` and `POST /api/v1/courses/:course_id/discussion_topics`.
- Direct message people using `POST /api/v1/conversations` or `GET /api/v1/conversations`.
- Reference the detailed guide for Communication & Groups:
  - **See Details**: [communication_and_groups.md](file:///home/likr/work/likr/canvas-lms-agent/.agents/skills/canvas-lms/references/features/communication_and_groups.md)

### 5. Personal Planning & Settings
To manage your schedule, notification preferences, or planner:
- Use `GET /api/v1/calendar_events` to retrieve deadlines and class sessions.
- Reference the detailed guide for User Settings & Customizations:
  - **See Details**: [users_and_customizations.md](file:///home/likr/work/likr/canvas-lms-agent/.agents/skills/canvas-lms/references/features/users_and_customizations.md)

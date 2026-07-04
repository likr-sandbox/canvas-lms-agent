# Assignments & Quizzes Reference - Canvas LMS

This reference guide covers operations related to creating, updating, and querying Assignments and Quizzes.

---

## Assignments

Assignments define due dates, grading schemes, and submission formats.

### 1. View Assignments
- **`GET /api/v1/courses/:course_id/assignments`**: Lists assignments in a course.
  - *Parameters*: `course_id`, `search_term` (Optional).
  - *Returns*: A list of Assignment objects containing `id`, `name`, `due_at`, `points_possible`, `submission_types`.
- **`GET /api/v1/courses/:course_id/assignments/:id`**: Retrieves details of a specific assignment.
  - *Parameters*: `course_id`, `id` (Assignment ID).

### 2. Manage Assignments (Teacher Only)
- **`POST /api/v1/courses/:course_id/assignments`**: Creates a new assignment.
  - *Parameters*: `course_id`, `assignment[name]`, `assignment[points_possible]`, `assignment[due_at]`, `assignment[submission_types][]` (e.g. `online_text_entry`, `online_url`, `online_upload`, `none`), `assignment[published]` (boolean).

  > [!IMPORTANT]
  > **MCP Parameter Nesting Requirement**
  > While the MCP schema uses flat parameter names like `assignment[name]`, you must structure the input argument as a nested `assignment` object when invoking this tool (and other POST/PUT tools) to avoid `400 Bad Request` errors:
  > ```json
  > {
  >   "course_id": "12345",
  >   "assignment": {
  >     "name": "Assignment Name",
  >     "points_possible": 100,
  >     "submission_types": ["online_text_entry"],
  >     "published": false
  >   }
  > }
  > ```
- **`PUT /api/v1/courses/:course_id/assignments/:id`**: Updates an existing assignment.
  - *Parameters*: `course_id`, `id`, `assignment[name]`, `assignment[published]`, etc.
- **`DELETE /api/v1/courses/:course_id/assignments/:id`**: Deletes an assignment.
  - *Parameters*: `course_id`, `id`.

---

## Quizzes

Quizzes consist of online assessments, surveys, or exams.

### 1. View Quizzes
- **`GET /api/v1/courses/:course_id/quizzes`**: Lists quizzes in a course.
  - *Parameters*: `course_id`.
  - *Returns*: Quiz objects containing `id`, `title`, `quiz_type`, `due_at`, `allowed_attempts`.
- **`GET /api/v1/courses/:course_id/quizzes/:id`**: Retrieves details of a specific quiz.
  - *Parameters*: `course_id`, `id` (Quiz ID).

### 2. Manage Quizzes (Teacher Only)
- **`POST /api/v1/courses/:course_id/quizzes`**: Creates a new quiz.
  - *Parameters*: `course_id`, `quiz[title]`, `quiz[description]`, `quiz[quiz_type]` (e.g. `assignment`, `practice_quiz`), `quiz[published]` (boolean).
- **`PUT /api/v1/courses/:course_id/quizzes/:id`**: Updates an existing quiz.
  - *Parameters*: `course_id`, `id`, `quiz[published]`, etc.
- **`delete_quiz`**: Deletes a quiz.
  - *Parameters*: `course_id`, `id`.

### 3. New Quizzes (LTI/Engine based)
- **`GET /api/v1/courses/:course_id/quizzes`** (New Quizzes API):
  - Canvas LMS has a modern quiz engine ("New Quizzes"). Check the tool definitions under `new_quizzes.js` if the course uses the new quiz engine instead of classic quizzes.

# Assignments & Quizzes Reference - Canvas LMS

This reference guide covers operations related to creating, updating, and querying Assignments and Quizzes.

---

## Assignments

Assignments define due dates, grading schemes, and submission formats.

### 1. View Assignments
- **`list_assignments`**: Lists assignments in a course.
  - *Parameters*: `course_id`, `search_term` (Optional).
  - *Returns*: A list of Assignment objects containing `id`, `name`, `due_at`, `points_possible`, `submission_types`.
- **`get_assignment`**: Retrieves details of a specific assignment.
  - *Parameters*: `course_id`, `id` (Assignment ID).

### 2. Manage Assignments (Teacher Only)
- **`create_assignment`**: Creates a new assignment.
  - *Parameters*: `course_id`, `assignment[name]`, `assignment[points_possible]`, `assignment[due_at]`, `assignment[submission_types][]` (e.g. `online_text_entry`, `online_url`, `online_upload`, `none`), `assignment[published]` (boolean).
- **`update_assignment`**: Updates an existing assignment.
  - *Parameters*: `course_id`, `id`, `assignment[name]`, `assignment[published]`, etc.
- **`delete_assignment`**: Deletes an assignment.
  - *Parameters*: `course_id`, `id`.

---

## Quizzes

Quizzes consist of online assessments, surveys, or exams.

### 1. View Quizzes
- **`list_quizzes`**: Lists quizzes in a course.
  - *Parameters*: `course_id`.
  - *Returns*: Quiz objects containing `id`, `title`, `quiz_type`, `due_at`, `allowed_attempts`.
- **`get_quiz`**: Retrieves details of a specific quiz.
  - *Parameters*: `course_id`, `id` (Quiz ID).

### 2. Manage Quizzes (Teacher Only)
- **`create_quiz`**: Creates a new quiz.
  - *Parameters*: `course_id`, `quiz[title]`, `quiz[description]`, `quiz[quiz_type]` (e.g. `assignment`, `practice_quiz`), `quiz[published]` (boolean).
- **`update_quiz`**: Updates an existing quiz.
  - *Parameters*: `course_id`, `id`, `quiz[published]`, etc.
- **`delete_quiz`**: Deletes a quiz.
  - *Parameters*: `course_id`, `id`.

### 3. New Quizzes (LTI/Engine based)
- **`list_new_quizzes`** / **`get_new_quiz`** (if implemented in `new_quizzes.js`):
  - Canvas LMS has a modern quiz engine ("New Quizzes"). Check the tool definitions under `new_quizzes.js` if the course uses the new quiz engine instead of classic quizzes.

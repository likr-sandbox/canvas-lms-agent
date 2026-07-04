# Submissions & Grades Reference - Canvas LMS

This reference guide covers submitting work, grading student submissions, sending feedback, and viewing Gradebook structures.

---

## Role-Based Grading Behaviors

> [!IMPORTANT]
> The Canvas API logic for grades and submissions depends heavily on the calling user's enrollment role (Student vs. Teacher/TA). Follow these guidelines to avoid permission errors (403/404).

### 1. Retrieving Submissions & Grades (`get_user_grades`)
This tool retrieves a list of student submissions for a given course.
- **For Students**:
  - **Usage**: Omit the `student_id` or `student_ids[]` parameters.
  - **Behavior**: Canvas returns only the calling student's own submissions and grades.
- **For Teachers / TAs / Administrators**:
  - **Usage**: You **MUST** specify the student IDs. Pass `student_ids[]=all` to retrieve submissions for all students in the course, or pass a specific student's ID (e.g. `student_ids[]=123`).
  - **Behavior**: Retrieves the grade roster. Note the `user_id` field in the response list to identify each student.

### 2. Modifying Grades or Comments (`grade_or_comment_submission`)
- **Usage**: Call with `course_id`, `assignment_id`, and `user_id` (the student's user ID).
- **Behavior**: Updates the grade and/or adds a text comment.
- > [!WARNING]
  > Never pass the teacher's own user ID as the `user_id` parameter here. Canvas will reject it with a 404 or 403 error. Always resolve the student's Canvas user ID dynamically (e.g. from `get_user_grades` or `list_users`) first.

---

## Tool Reference

### 1. Submitting Work (Student)
- **`submit_assignment`**: Submits an assignment.
  - *Parameters*: `course_id`, `assignment_id`, `submission[submission_type]` (e.g., `online_text_entry`, `online_url`, `online_upload`), `submission[body]` (for text entries), `submission[url]` (for URLs).

### 2. Reviewing Work (Teacher/TA)
- **`get_submission`**: Retrieves details of a single student's submission.
  - *Parameters*: `course_id`, `assignment_id`, `user_id` (Student ID), `include[]` (e.g. `submission_comments`).
  - *Usage*: Use this to read text submissions, check attachments, or retrieve the history of submission comments.

### 3. Grading & Feedback (Teacher/TA)
- **`grade_or_comment_submission`**: Sets a grade or adds a textual feedback comment.
  - *Parameters*: `course_id`, `assignment_id`, `user_id` (Student ID), `submission[posted_grade]` (e.g. `"A"`, `"95"`, `"complete"`), `comment[text_comment]` (Optional text feedback).

### 4. Gradebook Customization (Teacher/TA)
- **`list_custom_gradebook_columns`**: Lists custom columns in the course gradebook.
  - *Parameters*: `course_id`.
- **`create_custom_gradebook_column`**: Creates a custom column.
  - *Parameters*: `course_id`, `column[title]`, `column[teacher_notes]` (boolean).
- **`update_custom_gradebook_column_data`**: Enters custom column data for a specific student.
  - *Parameters*: `course_id`, `id` (Column ID), `user_id` (Student ID), `column_data[content]`.

# Users & Customizations Reference - Canvas LMS

This reference guide covers searching user profiles, scheduling appointments, managing personal notification preferences, and adjusting feature flags.

---

## Users

### 1. Roster Search
- **`GET /api/v1/courses/:course_id/users`**: Lists users enrolled in a course or section.
  - *Parameters*: `course_id`, `search_term` (Optional string to match names or emails), `enrollment_type[]` (e.g. `student`, `teacher`).
  - *Usage*: Essential for teachers to lookup a student's canvas `user_id` when grading or commenting on submissions.

---

## Enrollments

Enrollments link users (students, teachers, TAs) to courses or sections.

### 1. Manage Enrollments
- **`POST /api/v1/courses/:course_id/enrollments`**: Enrolls a user in a course.

  > [!IMPORTANT]
  > **MCP Parameter Nesting Requirement**
  > Structure the arguments as a nested `enrollment` object when invoking this tool. Passing flat keys like `enrollment[user_id]` will trigger a `400 No parameters given` error.
  > ```json
  > {
  >   "course_id": "12345",
  >   "enrollment": {
  >     "user_id": "55118",
  >     "type": "StudentEnrollment",
  >     "enrollment_state": "active"
  >   }
  > }
  > ```

### 2. SIS ID / Email Registration Shortcut
If you only have a student's email address or SIS ID and cannot lookup their numeric Canvas user ID (due to API permission constraints), you can resolve and register them directly by prepending the email with the `sis_user_id:` prefix in the `user_id` field:
```json
{
  "course_id": "12345",
  "enrollment": {
    "user_id": "sis_user_id:student_email@example.com",
    "type": "StudentEnrollment",
    "enrollment_state": "active"
  }
}
```

---

## Appointments (Appointment Groups)

Appointment groups allow instructors to create time slots that students can sign up for (e.g., office hours).

### 1. View Appointment Slots
- **`list_appointment_groups`**: Lists available appointment groups.
  - *Parameters*: `scope` (e.g., `current`, `past`).
- **`GET /api/v1/appointment_groups/:id`**: Retrieves details of a specific appointment group including reserved slots.

### 2. Manage Appointments (Teacher Only)
- **`create_appointment_group`**: Creates a new group of appointment slots.
  - *Parameters*: `title`, `description`, `context_codes[]` (e.g. `course_123`), `new_appointments[]` (list of sub-arrays containing start/end times).

---

## Feature Flags

Feature flags enable or disable experimental Canvas features at the course, account, or user level.

- **`list_features`**: Lists all features available in the current context.
  - *Parameters*: `context_type` (e.g. `courses`, `accounts`, `users`), `context_id`.
- **`GET /api/v1/courses/:course_id/features/flags/:feature`**: Retrieves state of a feature flag.
- **`set_feature_flag`**: Sets a feature flag state.
  - *Parameters*: `context_type`, `context_id`, `feature`, `state` (e.g. `on`, `off`, `allowed`).
- **`delete_feature_flag`**: Resets feature flag to default.

---

## Notification Preferences

Configures how and when Canvas sends notifications (e.g. immediately, daily, weekly, never) for channels like email or SMS.

- **`list_notification_preferences`**: Lists notification categories and current preferences.
  - *Parameters*: `user_id`, `communication_channel_id`.
- **`update_notification_preference`**: Modifies the preference for a specific category.
  - *Parameters*: `communication_channel_id`, `category`, `notification_preference[frequency]` (e.g. `immediately`, `daily`, `weekly`, `never`).

# Users & Customizations Reference - Canvas LMS

This reference guide covers searching user profiles, scheduling appointments, managing personal notification preferences, and adjusting feature flags.

---

## Users

### 1. Roster Search
- **`list_users`**: Lists users enrolled in a course or section.
  - *Parameters*: `course_id`, `search_term` (Optional string to match names or emails), `enrollment_type[]` (e.g. `student`, `teacher`).
  - *Usage*: Essential for teachers to lookup a student's canvas `user_id` when grading or commenting on submissions.

---

## Appointments (Appointment Groups)

Appointment groups allow instructors to create time slots that students can sign up for (e.g., office hours).

### 1. View Appointment Slots
- **`list_appointment_groups`**: Lists available appointment groups.
  - *Parameters*: `scope` (e.g., `current`, `past`).
- **`get_appointment_group`**: Retrieves details of a specific appointment group including reserved slots.

### 2. Manage Appointments (Teacher Only)
- **`create_appointment_group`**: Creates a new group of appointment slots.
  - *Parameters*: `title`, `description`, `context_codes[]` (e.g. `course_123`), `new_appointments[]` (list of sub-arrays containing start/end times).

---

## Feature Flags

Feature flags enable or disable experimental Canvas features at the course, account, or user level.

- **`list_features`**: Lists all features available in the current context.
  - *Parameters*: `context_type` (e.g. `courses`, `accounts`, `users`), `context_id`.
- **`get_feature_flag`**: Retrieves state of a feature flag.
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

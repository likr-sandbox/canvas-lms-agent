# Accounts & Admin Reference - Canvas LMS

This reference guide covers system administration, LTI integrations, student information system (SIS) imports, analytics, course migrations, blueprints, and reports.

---

## Accounts, Admins & Roles

These tools are restricted to Canvas system administrators.

### 1. Accounts & Roles
- **`list_accounts`**: Lists accounts accessible to the calling user.
- **`get_account`**: Retrieves details for a specific account.
- **`list_roles`**: Lists roles available to an account.
  - *Parameters*: `account_id`.

### 2. Administrators
- **`list_admins`**: Lists account administrators.
  - *Parameters*: `account_id`.
- **`add_admin`**: Promotes a user to administrator.
  - *Parameters*: `account_id`, `user_id`.
- **`remove_admin`**: Demotes an administrator.
  - *Parameters*: `account_id`, `user_id`.

---

## Course Admin & Data Migrations

Used by teachers or admins to copy, sync, or configure courses.

### 1. Blueprint Courses
Blueprint courses allow master templates to sync content to associated courses.
- **`list_blueprint_templates`**: Lists templates for a course.
- **`create_blueprint_migration`**: Triggers a content sync from the template to child courses.
  - *Parameters*: `course_id`, `template_id`.

### 2. Content Migrations
Imports course content from packages (zip, IMS Common Cartridge, other courses).
- **`list_content_migrations`**: Lists migrations for a course.
- **`create_content_migration`**: Starts a content import.
  - *Parameters*: `course_id`, `migration_type` (e.g. `canvas_cartridge_importer`, `common_cartridge_importer`).

---

## Reports & Analytics

Used to extract audit data, participation statistics, and grade distributions.

### 1. Generating Reports
Reports are processed asynchronously. First start the report, then poll the status until complete.
- **`start_course_report`** / **`start_account_report`**: Triggers a report run.
  - *Parameters*: `course_id`/`account_id`, `report_type` (e.g., `"student_guidelines"`, `"grade_export"`).
- **`get_course_report_status`** / **`get_account_report_status`**: Poll this to check if the file is ready.
  - *Returns*: Report object with `status` (`completed`, `running`) and `file_url`.

### 2. Analytics
- **`get_course_participation_data`**: Returns daily page view hits and participation numbers.
- **`get_course_grade_data`**: Returns distribution of grades for the course.
- **`get_course_student_summaries`**: Summarizes grades and participation per student.
  - *Parameters*: `course_id`.

---

## Integrations (SIS, LTI & External Tools)

Configures third-party integrations and batch imports.

### 1. SIS Imports
- **`create_sis_import`**: Uploads CSV files to provision users, courses, sections, and enrollments in bulk.
  - *Parameters*: `account_id`, `import_type`, `attachment` (CSV file data).
- **`get_sis_import`**: Retrieves status of a SIS import thread.

### 2. External Tools (LTI)
- **`list_external_tools`**: Lists LTI tools installed in the course.
- **`create_external_tool`**: Installs a new LTI external tool.
  - *Parameters*: `course_id`, `name`, `consumer_key`, `shared_secret`, `config_type`.

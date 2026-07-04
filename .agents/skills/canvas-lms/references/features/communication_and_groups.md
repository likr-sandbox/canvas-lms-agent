# Communication & Groups Reference - Canvas LMS

This reference guide covers course announcements, discussion boards, inbox conversations (direct messages), student groups, and collaborations.

---

## Announcements & Discussions

Announcements are technically Discussion Topics that are flagged to display only in the announcements section.

### 1. View Announcements & Discussions
- **`list_announcements`**: Retrieves a list of active announcements in the course.
  - *Parameters*: `context_codes[]` (Pass `course_XXXX` where `XXXX` is the course ID).
- **`list_discussion_topics`**: Lists all discussion topics in a course.
  - *Parameters*: `course_id`.

### 2. Manage Announcements & Discussions
- **`create_discussion_topic`**: Creates a new discussion topic or announcement.
  - *Parameters*: `course_id`, `title`, `message` (HTML body), `discussion_type` (e.g. `side_comment`, `threaded`), `is_announcement` (Set to `true` to make this an Announcement instead of a normal Discussion Topic).

---

## Conversations (Inbox Messaging)

Conversations represent direct messages sent between users inside Canvas.

### 1. Read Messages
- **`list_conversations`**: Lists conversations in the user's Inbox.
  - *Parameters*: `scope` (e.g. `unread`, `starred`, `archived`), `filter[]` (e.g. filter by course or user).
- **`get_conversation`**: Retrieves full details of a specific conversation thread including all messages.
  - *Parameters*: `id` (Conversation ID).

### 2. Send Messages
- **`create_conversation`**: Sends a message to one or more recipients.
  - *Parameters*: `recipients[]` (Array of recipient user IDs), `body` (Message content), `subject` (Optional subject line), `group_conversation` (boolean).
  - *Usage*: Use to communicate directly with students (teachers) or ask instructors questions (students).

---

## Groups & Collaborations

Groups allow students to work together on assignments, share files, and hold private discussions.

### 1. Groups & Categories
- **`list_group_categories`**: Lists categories for groups (e.g. "Project 1 Groups").
  - *Parameters*: `course_id`.
- **`create_group_category`**: Creates a new group category.
  - *Parameters*: `course_id`, `name`.
- **`list_groups`**: Lists groups within a course.
  - *Parameters*: `course_id`.
- **`create_group`**: Creates a group in a course.
  - *Parameters*: `course_id`, `name`, `description`.

### 2. Collaborations
- **`list_collaborations`**: Lists active collaborations (Google Docs, Office 365 docs, etc.) associated with a course.
  - *Parameters*: `course_id`.

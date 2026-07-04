# Project-Scoped Rules for Canvas LMS Agent Workspace

## Tech Stack & Language Guidelines
- **Plain JavaScript for Node.js Tools**: When building or modifying Node.js MCP servers, default to plain JavaScript (CommonJS or ESM as structured) instead of TypeScript to keep dependencies lightweight and eliminate compilation overhead, unless explicitly directed otherwise.

## Model Context Protocol (MCP) Stream Safety
- **Clean Standard Output (stdout)**:
  - The stdio MCP transport uses `stdout` for JSON-RPC communication. Absolutely NO non-JSON-RPC text should ever be printed to `stdout`.
  - All initialization messages, diagnostic prints, or debug statements inside MCP server code MUST be written to `console.error` (which pipes to `stderr`).
  - When starting a Node.js MCP server using npm script execution in subprocess configurations, always use the `--silent` flag (e.g. `npm --silent --prefix ... start`) to suppress npm startup headers that corrupt the JSON-RPC stream.

## Canvas LMS API Integration & Testing Guidelines
- **Role-Adaptive Submissions Handling**:
  - When querying student submissions, inspect the user's course enrollment. Teachers must query `student_ids[]=all` to fetch all submissions, whereas students query their own grades by omitting the `student_ids[]` parameter.
  - Modifying a grade or writing feedback comments requires the student's unique `user_id`. Do not pass the teacher's own `user_id` to student submission endpoints, as Canvas will reject it with a 404 Not Found or 403 Forbidden.
- **Dynamic Test ID Resolution**:
  - Avoid hardcoding static student IDs or user IDs in verification scripts.
  - Retrieve lists dynamically (e.g. fetching grades/courses first), select a valid student `user_id` from the active response data, and pass it dynamically to subsequent write/grading test cases.

## Git Workflow & Branch Policy
- **Branch Protection & Development Branch (`dev`)**: Direct pushes/commits to protected branches (e.g. `master` or main release branches) are restricted. Perform all future feature development, testing, and documentation edits on the `dev` branch.
- **Pull Request Operation**: Merging changes from the `dev` branch into protected main branches must be handled through Pull Requests (PRs) rather than direct merges or pushes.
- **Task Completion Workflow (Tests, Commits, & PRs)**: Upon completing any task, you must run all unit tests and create a Pull Request to merge your changes. Follow the detailed instructions in [git_workflow.md](file:///home/likr/work/likr/canvas-lms-agent/.agents/references/git_workflow.md).

## Rule Maintenance & Progressive Disclosure
- **Concise AGENTS.md**: Keep this rules document simple, clean, and highly scannable. Avoid bloat.
- **Reference Delegation**: When adding new guidelines, learnings, or detailed technical procedures, summarize them in a brief bullet point here, and delegate the comprehensive details (such as command examples, schemas, and scripts) to a separate file under `.agents/references/` or the respective skill's `references/` directory.
- **Explicit Linking**: Always include a clickable absolute Markdown link (`file://` scheme) from this file to the delegated detailed reference document.



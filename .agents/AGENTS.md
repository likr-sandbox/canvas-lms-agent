# Project-Scoped Rules for Canvas LMS Agent Workspace

## Tech Stack & Language Guidelines
- **Plain JavaScript for Node.js Tools**: When building or modifying Node.js MCP servers, default to plain JavaScript (CommonJS or ESM as structured) instead of TypeScript to keep dependencies lightweight and eliminate compilation overhead, unless explicitly directed otherwise.

## Model Context Protocol (MCP) Stream Safety
- **Clean Standard Output (stdout)**:
  - The stdio MCP transport uses `stdout` for JSON-RPC communication. Absolutely NO non-JSON-RPC text should ever be printed to `stdout`.
  - All initialization messages, diagnostic prints, or debug statements inside MCP server code MUST be written to `console.error` (which pipes to `stderr`).
  - When starting a Node.js MCP server using npm script execution in subprocess configurations, always use the `--silent` flag (e.g. `npm --silent --prefix ... start`) to suppress npm startup headers that corrupt the JSON-RPC stream.

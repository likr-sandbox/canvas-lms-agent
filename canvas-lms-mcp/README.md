# Canvas LMS MCP Server

A Model Context Protocol (MCP) server that connects Large Language Models (LLMs) to Canvas LMS APIs, enabling AI agents to manage courses, assignments, student submissions, discussions, announcements, and more.

## Features

- **Course Management**: List courses, search users, inspect sections, and check course lists.
- **Assignment Operations**: Retrieve assignments, create/update assignments, manage override dates, and assign peer reviews.
- **Submissions & Grading**: Retrieve student submissions, submit files/grades, add comments, and handle role-adaptive workflows (student vs. educator).
- **Discussions & Announcements**: Create, read, and moderate discussion topics and announcements.
- **Calendar & Planning**: Fetch planner items, calendar events, and blackout dates.

---

## Prerequisites

- **Node.js**: Version 18 or higher.
- **Canvas API Token**: Generate a token from your Canvas instance under **Account** > **Settings** > **Approved Integrations** > **New Access Token**.
- **Canvas Base URL**: The URL of your Canvas instance (e.g., `https://canvas.instructure.com` or `https://<your-school>.instructure.com`).

---

## Configuration & Usage

The easiest way to run the MCP server is via `npx`, which downloads and runs the server automatically.

### 1. Claude Desktop

Add the following configuration to your Claude Desktop configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "canvas-lms": {
      "command": "npx",
      "args": [
        "-y",
        "@likr/canvas-lms-mcp"
      ],
      "env": {
        "CANVAS_BASE_URL": "https://canvas.instructure.com",
        "CANVAS_API_TOKEN": "YOUR_CANVAS_API_TOKEN_HERE"
      }
    }
  }
}
```

### 2. Cursor

1. Open Cursor and go to **Settings** > **Features** > **MCP**.
2. Click **+ Add New MCP Server**.
3. Configure the following:
   - **Name**: `canvas-lms`
   - **Type**: `command`
   - **Command**: `npx -y @likr/canvas-lms-mcp`
4. Set the following Environment Variables in the Cursor interface:
   - `CANVAS_BASE_URL`: `https://canvas.instructure.com` (or your custom instance URL)
   - `CANVAS_API_TOKEN`: `YOUR_CANVAS_API_TOKEN_HERE`

### 3. Cline / Roo-Code

Add the server configuration to your Cline MCP settings file (typically at `~/.code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json` or similar):

```json
{
  "mcpServers": {
    "canvas-lms": {
      "command": "npx",
      "args": [
        "-y",
        "@likr/canvas-lms-mcp"
      ],
      "env": {
        "CANVAS_BASE_URL": "https://canvas.instructure.com",
        "CANVAS_API_TOKEN": "YOUR_CANVAS_API_TOKEN_HERE"
      }
    }
  }
}
```

---

## Canvas LMS Skill

This repository provides a dedicated `canvas-lms` skill for AI agents (supporting Antigravity or standard skill configurations). This skill provides the agent with structured best practices, role-adaptive behaviors (student vs. educator workflows), and reference guides to interact with the Canvas LMS APIs effectively.

To install this skill in your agent workspace, run:

```bash
npx skills add likr-sandbox/canvas-lms-agent@canvas-lms
```

---

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `CANVAS_BASE_URL` | The domain of your Canvas LMS instance (e.g. `https://canvas.instructure.com`). | `https://canvas.instructure.com` |
| `CANVAS_API_TOKEN` | Your Canvas API personal access token. **(Required)** | None |

---

## Development

If you wish to run the server locally for development:

1. Clone the repository and navigate to the directory:
   ```bash
   git clone https://github.com/likr-sandbox/canvas-lms-agent.git
   cd canvas-lms-agent/canvas-lms-mcp
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   CANVAS_BASE_URL=https://canvas.instructure.com
   CANVAS_API_TOKEN=your_token_here
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Run tests:
   ```bash
   npm test
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

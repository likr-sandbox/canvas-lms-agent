#!/usr/bin/env node
require("dotenv").config();

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");
const axios = require("axios");

const { getCanvasClient } = require("./client");
const { allDefinitions, allHandlers } = require("./tools");

// Create server instance
const server = new Server(
  {
    name: "canvas-lms-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allDefinitions,
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const handler = allHandlers[name];
    if (!handler) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Unknown tool: ${name}`,
          },
        ],
      };
    }

    const client = getCanvasClient();
    const result = await handler(client, args || {});

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    let errorMsg = error.message;
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const data = error.response.data;
      errorMsg = `Canvas API returned status code ${status}: ${JSON.stringify(data)}`;
      if (status === 401) {
        errorMsg = "Unauthorized: Please verify that CANVAS_API_TOKEN is valid.";
      } else if (status === 404) {
        errorMsg = "Not Found: The requested endpoint was not found on Canvas.";
      }
    }
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error executing tool '${name}': ${errorMsg}`,
        },
      ],
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Canvas LMS MCP Server started successfully (stdio)");
}

main().catch((error) => {
  console.error("Fatal error starting Canvas LMS MCP Server:", error);
  process.exit(1);
});

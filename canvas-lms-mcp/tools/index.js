const path = require("path");
const fs = require("fs");
const { callCanvasApi } = require("./helper");

// Load endpoints synchronously since it's just a JSON file and needed at startup
const endpointsPath = path.join(__dirname, "endpoints.json");
const endpointsData = JSON.parse(fs.readFileSync(endpointsPath, "utf-8"));

const allDefinitions = [
  {
    name: "search_canvas_api",
    description: "Search for Canvas LMS API endpoints and their schemas. Use this when you need to find the correct path, method, or parameters for a Canvas LMS API call.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query to filter endpoints by path or description (e.g., 'courses', 'get users')."
        }
      },
      required: ["query"]
    }
  },
  {
    name: "call_canvas_api",
    description: "Call a Canvas LMS API endpoint. You must construct the path yourself based on the API documentation or search results.",
    inputSchema: {
      type: "object",
      properties: {
        method: {
          type: "string",
          description: "HTTP method (GET, POST, PUT, DELETE)"
        },
        path: {
          type: "string",
          description: "API path starting with a slash (e.g., /api/v1/courses/1). Note: Do NOT use path templates like :course_id. You must provide the actual evaluated path."
        },
        query_params: {
          type: "object",
          description: "Query parameters (optional)"
        },
        body_params: {
          type: "object",
          description: "Body parameters for POST/PUT (optional)"
        }
      },
      required: ["method", "path"]
    }
  }
];

const allHandlers = {
  search_canvas_api: async (client, args) => {
    const query = args.query.toLowerCase();
    const results = endpointsData.filter(ep => {
      return ep.path.toLowerCase().includes(query) || 
             ep.description.toLowerCase().includes(query);
    });
    
    // Limit to top 50 results to avoid massive responses
    return {
      results: results.slice(0, 50),
      total_matches: results.length,
      truncated: results.length > 50
    };
  },
  call_canvas_api: async (client, args) => {
    return callCanvasApi(
      client,
      args.method,
      args.path,
      args.query_params || {},
      args.body_params || {}
    );
  }
};

module.exports = {
  allDefinitions,
  allHandlers,
};

const definitions = [
  {
    name: "list_account_reports",
    description: "Returns a paginated list of reports for the current account context.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account."
        }
      },
      required: ["account_id"]
    }
  },
  {
    name: "start_account_report",
    description: "Generates a report instance for the account.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account."
        },
        report_type: {
          type: "string",
          description: "The type of report to generate (e.g. 'sis_export_csv')."
        },
        parameters: {
          type: "object",
          description: "Optional parameters for the report."
        }
      },
      required: ["account_id", "report_type"]
    }
  },
  {
    name: "get_account_report_status",
    description: "Returns the status of an account report.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account."
        },
        report_type: {
          type: "string",
          description: "The type of report."
        },
        id: {
          type: "number",
          description: "The unique ID of the report."
        }
      },
      required: ["account_id", "report_type", "id"]
    }
  },
  {
    name: "delete_account_report",
    description: "Deletes a generated account report.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "number",
          description: "The unique ID of the account."
        },
        report_type: {
          type: "string",
          description: "The type of report."
        },
        id: {
          type: "number",
          description: "The unique ID of the report."
        }
      },
      required: ["account_id", "report_type", "id"]
    }
  },
  {
    name: "list_course_reports",
    description: "Returns a list of reports for the course context.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        }
      },
      required: ["course_id"]
    }
  },
  {
    name: "start_course_report",
    description: "Generates a report instance for the course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        report_type: {
          type: "string",
          description: "The type of report to generate."
        },
        parameters: {
          type: "object",
          description: "Optional parameters for the report."
        }
      },
      required: ["course_id", "report_type"]
    }
  },
  {
    name: "get_course_report_status",
    description: "Returns the status of a course report.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        report_type: {
          type: "string",
          description: "The type of report."
        },
        id: {
          type: "number",
          description: "The unique ID of the report."
        }
      },
      required: ["course_id", "report_type", "id"]
    }
  },
  {
    name: "delete_course_report",
    description: "Deletes a generated course report.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course."
        },
        report_type: {
          type: "string",
          description: "The type of report."
        },
        id: {
          type: "number",
          description: "The unique ID of the report."
        }
      },
      required: ["course_id", "report_type", "id"]
    }
  }
];

const handlers = {
  list_account_reports: async (client, args) => {
    const { account_id } = args;
    const response = await client.get(`/api/v1/accounts/${account_id}/reports`);
    return response.data;
  },

  start_account_report: async (client, args) => {
    const { account_id, report_type, parameters } = args;
    const response = await client.post(`/api/v1/accounts/${account_id}/reports/${report_type}`, {
      parameters
    });
    return response.data;
  },

  get_account_report_status: async (client, args) => {
    const { account_id, report_type, id } = args;
    const response = await client.get(`/api/v1/accounts/${account_id}/reports/${report_type}/${id}`);
    return response.data;
  },

  delete_account_report: async (client, args) => {
    const { account_id, report_type, id } = args;
    const response = await client.delete(`/api/v1/accounts/${account_id}/reports/${report_type}/${id}`);
    return response.data;
  },

  list_course_reports: async (client, args) => {
    const { course_id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/reports`);
    return response.data;
  },

  start_course_report: async (client, args) => {
    const { course_id, report_type, parameters } = args;
    const response = await client.post(`/api/v1/courses/${course_id}/reports/${report_type}`, {
      parameters
    });
    return response.data;
  },

  get_course_report_status: async (client, args) => {
    const { course_id, report_type, id } = args;
    const response = await client.get(`/api/v1/courses/${course_id}/reports/${report_type}/${id}`);
    return response.data;
  },

  delete_course_report: async (client, args) => {
    const { course_id, report_type, id } = args;
    const response = await client.delete(`/api/v1/courses/${course_id}/reports/${report_type}/${id}`);
    return response.data;
  }
};

module.exports = {
  definitions,
  handlers
};

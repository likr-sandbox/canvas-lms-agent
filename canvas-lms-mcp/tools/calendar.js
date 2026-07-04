const definitions = [
  {
    name: "list_calendar_events",
    description: "Retrieves the list of calendar events for courses or the current user.",
    inputSchema: {
      type: "object",
      properties: {
        all_events: {
          type: "boolean",
          description: "Optional. Set to true to include both user and course calendar events.",
        },
      },
      properties: {},
    },
  },
];

const handlers = {
  list_calendar_events: async (client, args) => {
    const params = {
      type: args.all_events ? "all" : "event",
    };
    const response = await client.get("/api/v1/calendar_events", { params });
    const events = Array.isArray(response.data) ? response.data : [];
    return events.map(e => ({
      id: e.id,
      title: e.title,
      start_at: e.start_at,
      end_at: e.end_at,
      description: e.description,
      context_code: e.context_code,
      all_day: e.all_day,
    }));
  },
};

module.exports = {
  definitions,
  handlers,
};

const test = require("node:test");
const assert = require("node:assert");
const calendar = require("../tools/calendar");

test("list_calendar_events lists calendar events with correct params", async () => {
  let calledUrl = null;
  let calledParams = null;

  const mockClient = {
    get: async (url, config) => {
      calledUrl = url;
      calledParams = config?.params;
      return {
        data: [
          {
            id: "event-123",
            title: "Exam",
            start_at: "2026-07-15T09:00:00Z",
            end_at: "2026-07-15T11:00:00Z",
            description: "Final Exam",
            context_code: "course_101",
            all_day: false,
          },
        ],
      };
    },
  };

  const result = await calendar.handlers.list_calendar_events(mockClient, { all_events: true });
  assert.strictEqual(calledUrl, "/api/v1/calendar_events");
  assert.deepStrictEqual(calledParams, { type: "all" });
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    id: "event-123",
    title: "Exam",
    start_at: "2026-07-15T09:00:00Z",
    end_at: "2026-07-15T11:00:00Z",
    description: "Final Exam",
    context_code: "course_101",
    all_day: false,
  });
});

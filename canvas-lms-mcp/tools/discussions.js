const definitions = [
  {
    name: "list_discussion_topics",
    description: "Retrieves the list of discussion topics for a specific Canvas course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the Canvas course.",
        },
      },
      required: ["course_id"],
    },
  },
  {
    name: "list_announcements",
    description: "Retrieves announcements (system updates and course bulletins) for a specific Canvas course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the Canvas course.",
        },
      },
      required: ["course_id"],
    },
  },
];

const handlers = {
  list_discussion_topics: async (client, args) => {
    const courseId = args.course_id;
    if (!courseId) {
      throw new Error("Missing required argument: course_id");
    }
    const response = await client.get(`/api/v1/courses/${courseId}/discussion_topics`);
    const topics = Array.isArray(response.data) ? response.data : [];
    return topics.map(t => ({
      id: t.id,
      title: t.title,
      message: t.message,
      posted_at: t.posted_at,
      user_name: t.user_name,
      last_reply_at: t.last_reply_at,
      discussion_type: t.discussion_type,
    }));
  },

  list_announcements: async (client, args) => {
    const courseId = args.course_id;
    if (!courseId) {
      throw new Error("Missing required argument: course_id");
    }
    const response = await client.get(`/api/v1/courses/${courseId}/discussion_topics`, {
      params: { only_announcements: true }
    });
    const topics = Array.isArray(response.data) ? response.data : [];
    return topics.map(a => ({
      id: a.id,
      title: a.title,
      message: a.message,
      posted_at: a.posted_at,
      user_name: a.user_name,
      last_reply_at: a.last_reply_at,
      locked: a.locked,
      pinned: a.pinned,
    }));
  },
};

module.exports = {
  definitions,
  handlers,
};

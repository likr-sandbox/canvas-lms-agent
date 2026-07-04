const definitions = [
  {
    name: "get_outcome",
    description: "Returns details of a specific outcome by ID.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The unique ID of the outcome.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "update_outcome",
    description: "Updates an existing learning outcome.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The unique ID of the outcome.",
        },
        title: {
          type: "string",
          description: "The title of the outcome.",
        },
        description: {
          type: "string",
          description: "A description of the outcome.",
        },
        mastery_points: {
          type: "number",
          description: "The number of points required for mastery.",
        },
        ratings: {
          type: "array",
          items: {
            type: "object",
            properties: {
              points: { type: "number" },
              description: { type: "string" },
            },
            required: ["points", "description"],
          },
          description: "An array of rating levels for rubrics based on this outcome.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_outcome_groups",
    description: "Returns a list of outcome groups for a course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course.",
        },
      },
      required: ["course_id"],
    },
  },
  {
    name: "get_outcome_group",
    description: "Returns details of a specific outcome group.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course.",
        },
        id: {
          type: "number",
          description: "The unique ID of the outcome group.",
        },
      },
      required: ["course_id", "id"],
    },
  },
  {
    name: "list_outcome_results",
    description: "Returns alignment assessment results for a course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course.",
        },
        user_ids: {
          type: "array",
          items: { type: "number" },
          description: "Limit results to these student user IDs.",
        },
        outcome_ids: {
          type: "array",
          items: { type: "number" },
          description: "Limit results to these outcome IDs.",
        },
      },
      required: ["course_id"],
    },
  },
  {
    name: "list_outcome_rollups",
    description: "Returns outcome rollups (scores compiled per student) for a course.",
    inputSchema: {
      type: "object",
      properties: {
        course_id: {
          type: "number",
          description: "The unique ID of the course.",
        },
        user_ids: {
          type: "array",
          items: { type: "number" },
          description: "Limit rollups to these student user IDs.",
        },
        outcome_ids: {
          type: "array",
          items: { type: "number" },
          description: "Limit rollups to these outcome IDs.",
        },
      },
      required: ["course_id"],
    },
  },
];

const handlers = {
  get_outcome: async (client, args) => {
    const id = args.id;
    if (!id) {
      throw new Error("Missing required argument: id");
    }
    const response = await client.get(`/api/v1/outcomes/${id}`);
    const o = response.data || {};
    return {
      id: o.id,
      title: o.title,
      description: o.description,
      mastery_points: o.mastery_points,
      points_possible: o.points_possible,
      ratings: o.ratings || [],
    };
  },

  update_outcome: async (client, args) => {
    const { id, title, description, mastery_points, ratings } = args;
    if (!id) {
      throw new Error("Missing required argument: id");
    }
    const payload = {};
    if (title !== undefined) payload.title = title;
    if (description !== undefined) payload.description = description;
    if (mastery_points !== undefined) payload.mastery_points = mastery_points;
    if (ratings !== undefined) payload.ratings = ratings;

    const response = await client.put(`/api/v1/outcomes/${id}`, payload);
    const o = response.data || {};
    return {
      id: o.id,
      title: o.title,
      description: o.description,
      mastery_points: o.mastery_points,
      points_possible: o.points_possible,
      ratings: o.ratings || [],
    };
  },

  list_outcome_groups: async (client, args) => {
    const course_id = args.course_id;
    if (!course_id) {
      throw new Error("Missing required argument: course_id");
    }
    const response = await client.get(`/api/v1/courses/${course_id}/outcome_groups`);
    const groups = Array.isArray(response.data) ? response.data : [];
    return groups.map(g => ({
      id: g.id,
      title: g.title,
      description: g.description,
      vendor_guid: g.vendor_guid,
      subgroups_url: g.subgroups_url,
      outcomes_url: g.outcomes_url,
    }));
  },

  get_outcome_group: async (client, args) => {
    const { course_id, id } = args;
    if (!course_id || !id) {
      throw new Error("Missing required arguments: course_id, id");
    }
    const response = await client.get(`/api/v1/courses/${course_id}/outcome_groups/${id}`);
    const g = response.data || {};
    return {
      id: g.id,
      title: g.title,
      description: g.description,
      vendor_guid: g.vendor_guid,
      subgroups_url: g.subgroups_url,
      outcomes_url: g.outcomes_url,
    };
  },

  list_outcome_results: async (client, args) => {
    const course_id = args.course_id;
    if (!course_id) {
      throw new Error("Missing required argument: course_id");
    }
    const params = {};
    if (args.user_ids) params.user_ids = args.user_ids;
    if (args.outcome_ids) params.outcome_ids = args.outcome_ids;

    const response = await client.get(`/api/v1/courses/${course_id}/outcome_results`, { params });
    const data = response.data || {};
    const results = Array.isArray(data.outcome_results) ? data.outcome_results : [];
    return results.map(r => ({
      id: r.id,
      score: r.score,
      submitted_at: r.submitted_at,
      percent: r.percent,
      links: r.links,
    }));
  },

  list_outcome_rollups: async (client, args) => {
    const course_id = args.course_id;
    if (!course_id) {
      throw new Error("Missing required argument: course_id");
    }
    const params = {};
    if (args.user_ids) params.user_ids = args.user_ids;
    if (args.outcome_ids) params.outcome_ids = args.outcome_ids;

    const response = await client.get(`/api/v1/courses/${course_id}/outcome_rollups`, { params });
    const data = response.data || {};
    const rollups = Array.isArray(data.rollups) ? data.rollups : [];
    return rollups.map(r => ({
      links: r.links,
      scores: r.scores ? r.scores.map(s => ({
        outcome_id: s.links ? s.links.outcome : null,
        score: s.score,
        count: s.count,
      })) : [],
    }));
  },
};

module.exports = {
  definitions,
  handlers,
};

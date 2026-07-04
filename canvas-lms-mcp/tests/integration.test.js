const test = require("node:test");
const assert = require("node:assert");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Load .env from workspace root
const envPath = path.join(__dirname, "../../.env");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
}

const runIntegration = !!(process.env.CANVAS_API_TOKEN && process.env.CANVAS_BASE_URL);

test("Canvas LMS MCP Server Integration Tests", { skip: !runIntegration }, async (t) => {
  console.log(`Running integration tests against: ${process.env.CANVAS_BASE_URL}`);

  // Helper to manage JSON-RPC communication with spawned MCP server
  const spawnMcpServer = () => {
    const serverPath = path.join(__dirname, "../index.js");
    const proc = spawn("node", [serverPath], {
      stdio: ["pipe", "pipe", "pipe"],
      env: process.env,
    });

    // Pipe stderr to test console for diagnostics
    proc.stderr.on("data", (data) => {
      console.error(`[Server Stderr] ${data.toString().trim()}`);
    });

    let buffer = "";
    const pendingPromises = [];

    proc.stdout.on("data", (data) => {
      buffer += data.toString();
      let lineEnd;
      while ((lineEnd = buffer.indexOf("\n")) !== -1) {
        const line = buffer.substring(0, lineEnd).trim();
        buffer = buffer.substring(lineEnd + 1);
        if (line) {
          try {
            const parsed = JSON.parse(line);
            const promiseObj = pendingPromises.shift();
            if (promiseObj) {
              promiseObj.resolve(parsed);
            }
          } catch (e) {
            console.error("Failed to parse JSON response line:", line, e);
          }
        }
      }
    });

    proc.on("close", (code) => {
      for (const p of pendingPromises) {
        p.reject(new Error(`Server closed with code ${code}`));
      }
    });

    const sendRequest = (method, params, id) => {
      return new Promise((resolve, reject) => {
        pendingPromises.push({ resolve, reject });
        const reqPayload = {
          jsonrpc: "2.0",
          method,
          params,
          id,
        };
        proc.stdin.write(JSON.stringify(reqPayload) + "\n");
      });
    };

    const terminate = () => {
      proc.kill();
    };

    return { sendRequest, terminate };
  };

  const client = spawnMcpServer();

  try {
    // Step 1: List all tools
    await t.test("tools/list lists all 18 tools", async () => {
      const resp = await client.sendRequest("tools/list", {}, 1);
      assert.ok(resp.result, "tools/list should return a result");
      const tools = resp.result.tools || [];
      const toolNames = tools.map((t) => t.name);
      console.log("Available tools from server:", toolNames);

      const expectedTools = [
        "get_current_user",
        "list_courses",
        "list_assignments",
        "get_user_grades",
        "list_modules",
        "list_files",
        "list_discussion_topics",
        "list_announcements",
        "list_pages",
        "get_page",
        "list_quizzes",
        "grade_or_comment_submission",
        "submit_assignment",
        "list_users",
        "list_sections",
        "list_enrollments",
        "list_calendar_events",
        "list_rubrics",
      ];

      for (const expected of expectedTools) {
        assert.ok(toolNames.includes(expected), `Missing expected tool: ${expected}`);
      }
    });

    // Step 2: get_current_user
    let currentUserId;
    await t.test("get_current_user returns user details", async () => {
      const resp = await client.sendRequest("tools/call", { name: "get_current_user", arguments: {} }, 2);
      assert.ok(!resp.error, "get_current_user returned RPC error");
      const result = resp.result || {};
      assert.ok(!result.isError, `get_current_user failed: ${JSON.stringify(result)}`);
      
      const contentText = result.content[0].text;
      const userData = JSON.parse(contentText);
      assert.ok(userData.id, "User ID should be present");
      currentUserId = userData.id;
      console.log(`Authenticated as user: ${userData.name} (ID: ${userData.id})`);
    });

    // Step 3: list_courses
    let activeCourseId;
    await t.test("list_courses returns active courses", async () => {
      const resp = await client.sendRequest("tools/call", { name: "list_courses", arguments: {} }, 3);
      assert.ok(!resp.error, "list_courses returned RPC error");
      const result = resp.result || {};
      assert.ok(!result.isError, `list_courses failed: ${JSON.stringify(result)}`);
      
      const courses = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(courses), "Courses should be an array");
      console.log(`Found ${courses.length} active courses`);
      if (courses.length > 0) {
        activeCourseId = courses[0].id;
        console.log(`First course ID: ${activeCourseId}`);
      }
    });

    if (!activeCourseId) {
      console.log("No active courses found. Skipping course-dependent integration tests.");
      return;
    }

    // Step 4: list_assignments
    await t.test("list_assignments returns assignments", async () => {
      const resp = await client.sendRequest("tools/call", {
        name: "list_assignments",
        arguments: { course_id: activeCourseId }
      }, 4);
      assert.ok(!resp.error);
      const result = resp.result || {};
      assert.ok(!result.isError);
      const assignments = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(assignments));
      console.log(`Found ${assignments.length} assignments`);
    });

    // Step 5: get_user_grades
    let studentId;
    await t.test("get_user_grades returns grades", async () => {
      const resp = await client.sendRequest("tools/call", {
        name: "get_user_grades",
        arguments: { course_id: activeCourseId }
      }, 5);
      assert.ok(!resp.error);
      const result = resp.result || {};
      assert.ok(!result.isError);
      const grades = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(grades));
      console.log(`Found ${grades.length} grades`);
      if (grades.length > 0 && grades[0].user_id) {
        studentId = grades[0].user_id;
      } else {
        studentId = 32362; // fallback from verify_mcp.py
      }
    });

    // Step 6: list_modules
    await t.test("list_modules returns modules with items", async () => {
      const resp = await client.sendRequest("tools/call", {
        name: "list_modules",
        arguments: { course_id: activeCourseId, include_items: true }
      }, 6);
      assert.ok(!resp.error);
      const result = resp.result || {};
      assert.ok(!result.isError);
      const modules = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(modules));
      console.log(`Found ${modules.length} modules`);
    });

    // Step 7: list_files
    await t.test("list_files returns files", async () => {
      const resp = await client.sendRequest("tools/call", {
        name: "list_files",
        arguments: { course_id: activeCourseId }
      }, 7);
      assert.ok(!resp.error);
      const result = resp.result || {};
      assert.ok(!result.isError);
      const files = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(files));
      console.log(`Found ${files.length} files`);
    });

    // Step 8: list_discussion_topics
    await t.test("list_discussion_topics returns topics", async () => {
      const resp = await client.sendRequest("tools/call", {
        name: "list_discussion_topics",
        arguments: { course_id: activeCourseId }
      }, 8);
      assert.ok(!resp.error);
      const result = resp.result || {};
      assert.ok(!result.isError);
      const topics = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(topics));
      console.log(`Found ${topics.length} discussion topics`);
    });

    // Step 9: list_announcements
    await t.test("list_announcements returns announcements", async () => {
      const resp = await client.sendRequest("tools/call", {
        name: "list_announcements",
        arguments: { course_id: activeCourseId }
      }, 9);
      assert.ok(!resp.error);
      const result = resp.result || {};
      assert.ok(!result.isError);
      const announcements = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(announcements));
      console.log(`Found ${announcements.length} announcements`);
    });

    // Step 10 & 11: list_pages & get_page
    await t.test("list_pages and get_page flow", async () => {
      const listResp = await client.sendRequest("tools/call", {
        name: "list_pages",
        arguments: { course_id: activeCourseId }
      }, 10);
      assert.ok(!listResp.error);
      const listResult = listResp.result || {};
      assert.ok(!listResult.isError);
      const pages = JSON.parse(listResult.content[0].text);
      assert.ok(Array.isArray(pages));
      console.log(`Found ${pages.length} wiki pages`);

      if (pages.length > 0) {
        const pageUrl = pages[0].url;
        const getResp = await client.sendRequest("tools/call", {
          name: "get_page",
          arguments: { course_id: activeCourseId, url_or_id: pageUrl }
        }, 11);
        assert.ok(!getResp.error);
        const getResult = getResp.result || {};
        assert.ok(!getResult.isError);
        const pageDetail = JSON.parse(getResult.content[0].text);
        assert.ok(pageDetail.title);
        console.log(`Retrieved page: ${pageDetail.title}`);
      }
    });

    // Step 12: list_quizzes
    await t.test("list_quizzes returns quizzes", async () => {
      const resp = await client.sendRequest("tools/call", {
        name: "list_quizzes",
        arguments: { course_id: activeCourseId }
      }, 12);
      assert.ok(!resp.error);
      const result = resp.result || {};
      assert.ok(!result.isError);
      const quizzes = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(quizzes));
      console.log(`Found ${quizzes.length} quizzes`);
    });

    // Step 13: submit_assignment (gracefully handle API restriction or role issue)
    await t.test("submit_assignment execution", async () => {
      const resp = await client.sendRequest("tools/call", {
        name: "submit_assignment",
        arguments: {
          course_id: activeCourseId,
          assignment_id: 150469, // class test 1 from verify_mcp.py
          submission_type: "online_text_entry",
          body: "Test submission content from Node.js integration tests",
        }
      }, 13);
      assert.ok(!resp.error);
      const result = resp.result || {};
      if (result.isError) {
        console.log("submit_assignment returned expected restriction or role error:", result.content[0].text);
      } else {
        const submitData = JSON.parse(result.content[0].text);
        assert.ok(submitData.id);
        console.log("submit_assignment success:", submitData);
      }
    });

    // Step 14: grade_or_comment_submission (gracefully handle API restriction or role issue)
    await t.test("grade_or_comment_submission execution", async () => {
      const resp = await client.sendRequest("tools/call", {
        name: "grade_or_comment_submission",
        arguments: {
          course_id: activeCourseId,
          assignment_id: 150469,
          user_id: studentId,
          text_comment: "Automated verification comment from Node.js",
        }
      }, 14);
      assert.ok(!resp.error);
      const result = resp.result || {};
      if (result.isError) {
        console.log("grade_or_comment_submission returned expected restriction or role error:", result.content[0].text);
      } else {
        const gradeData = JSON.parse(result.content[0].text);
        assert.ok(gradeData.user_id);
        console.log("grade_or_comment_submission success:", gradeData);
      }
    });

    // Step 15: list_users
    await t.test("list_users returns users", async () => {
      const resp = await client.sendRequest("tools/call", {
        name: "list_users",
        arguments: { course_id: activeCourseId }
      }, 15);
      assert.ok(!resp.error);
      const result = resp.result || {};
      assert.ok(!result.isError);
      const users = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(users));
      console.log(`Found ${users.length} users`);
    });

    // Step 16: list_sections
    await t.test("list_sections returns sections", async () => {
      const resp = await client.sendRequest("tools/call", {
        name: "list_sections",
        arguments: { course_id: activeCourseId }
      }, 16);
      assert.ok(!resp.error);
      const result = resp.result || {};
      assert.ok(!result.isError);
      const sections = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(sections));
      console.log(`Found ${sections.length} sections`);
    });

    // Step 17: list_enrollments
    await t.test("list_enrollments returns enrollments", async () => {
      const resp = await client.sendRequest("tools/call", {
        name: "list_enrollments",
        arguments: { course_id: activeCourseId }
      }, 17);
      assert.ok(!resp.error);
      const result = resp.result || {};
      assert.ok(!result.isError);
      const enrollments = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(enrollments));
      console.log(`Found ${enrollments.length} enrollments`);
    });

    // Step 18: list_calendar_events
    await t.test("list_calendar_events returns events", async () => {
      const resp = await client.sendRequest("tools/call", {
        name: "list_calendar_events",
        arguments: {}
      }, 18);
      assert.ok(!resp.error);
      const result = resp.result || {};
      assert.ok(!result.isError);
      const events = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(events));
      console.log(`Found ${events.length} calendar events`);
    });

    // Step 19: list_rubrics
    await t.test("list_rubrics returns rubrics", async () => {
      const resp = await client.sendRequest("tools/call", {
        name: "list_rubrics",
        arguments: { course_id: activeCourseId }
      }, 19);
      assert.ok(!resp.error);
      const result = resp.result || {};
      assert.ok(!result.isError);
      const rubrics = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(rubrics));
      console.log(`Found ${rubrics.length} rubrics`);
    });

  } finally {
    client.terminate();
  }
});

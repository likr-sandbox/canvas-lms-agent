const courses = require("./courses");
const assignments = require("./assignments");
const submissions = require("./submissions");
const modules = require("./modules");
const files = require("./files");
const discussions = require("./discussions");
const pages = require("./pages");
const quizzes = require("./quizzes");
const users = require("./users");
const sections = require("./sections");
const enrollments = require("./enrollments");
const calendar = require("./calendar");
const rubrics = require("./rubrics");
const accounts = require("./accounts");
const conversations = require("./conversations");
const groups = require("./groups");
const outcomes = require("./outcomes");
const integrations = require("./integrations");
const analytics = require("./analytics");
const reports = require("./reports");
const authentications = require("./authentications");
const course_admin = require("./course_admin");
const customizations = require("./customizations");

const allDefinitions = [
  ...courses.definitions,
  ...assignments.definitions,
  ...submissions.definitions,
  ...modules.definitions,
  ...files.definitions,
  ...discussions.definitions,
  ...pages.definitions,
  ...quizzes.definitions,
  ...users.definitions,
  ...sections.definitions,
  ...enrollments.definitions,
  ...calendar.definitions,
  ...rubrics.definitions,
  ...accounts.definitions,
  ...conversations.definitions,
  ...groups.definitions,
  ...outcomes.definitions,
  ...integrations.definitions,
  ...analytics.definitions,
  ...reports.definitions,
  ...authentications.definitions,
  ...course_admin.definitions,
  ...customizations.definitions,
];

const allHandlers = {
  ...courses.handlers,
  ...assignments.handlers,
  ...submissions.handlers,
  ...modules.handlers,
  ...files.handlers,
  ...discussions.handlers,
  ...pages.handlers,
  ...quizzes.handlers,
  ...users.handlers,
  ...sections.handlers,
  ...enrollments.handlers,
  ...calendar.handlers,
  ...rubrics.handlers,
  ...accounts.handlers,
  ...conversations.handlers,
  ...groups.handlers,
  ...outcomes.handlers,
  ...integrations.handlers,
  ...analytics.handlers,
  ...reports.handlers,
  ...authentications.handlers,
  ...course_admin.handlers,
  ...customizations.handlers,
};

module.exports = {
  allDefinitions,
  allHandlers,
};

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
};

module.exports = {
  allDefinitions,
  allHandlers,
};

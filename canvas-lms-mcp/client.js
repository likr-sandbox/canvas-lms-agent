const axios = require("axios");

const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL || "https://canvas.instructure.com";
const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;

function getCanvasClient() {
  if (!CANVAS_API_TOKEN) {
    throw new Error("CANVAS_API_TOKEN environment variable is not configured.");
  }
  return axios.create({
    baseURL: CANVAS_BASE_URL.replace(/\/$/, ""),
    headers: {
      Authorization: `Bearer ${CANVAS_API_TOKEN}`,
      Accept: "application/json",
    },
  });
}

module.exports = {
  getCanvasClient,
  CANVAS_BASE_URL,
  CANVAS_API_TOKEN
};

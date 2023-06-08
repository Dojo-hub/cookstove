const express = require("express");
const {
  deviceEvents,
  eventsData,
  graphData,
  eventLogs,
} = require("../controllers/events/events.controller");
const router = express.Router();

router.get("/data", eventsData);

router.get("/events", graphData);

router.get("/logs/:eventId", eventLogs);

router.get("/:deviceId", deviceEvents);

module.exports = router;

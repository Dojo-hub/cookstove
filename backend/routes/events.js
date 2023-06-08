const express = require("express");
const {
  deviceEvents,
  eventsData,
  graphData,
} = require("../controllers/events/events.controller");
const router = express.Router();

router.get("/data", eventsData);

router.get("/events", graphData);

router.get("/:deviceId", deviceEvents);

module.exports = router;

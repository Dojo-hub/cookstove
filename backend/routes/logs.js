const express = require("express");
const router = express.Router();
const device = require("../controllers/devices/device.controller.js")
const validateUser = require("../middleware/validatejwt");

router.post("/logs", device.createLog);

router.get("/:id", validateUser, device.getLogs);

module.exports = router;

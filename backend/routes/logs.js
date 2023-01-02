const express = require("express");
const router = express.Router();
const db = require("../models/index");
const device = require("../controllers/devices/device.controller.js")

router.get("/:id", device.getLogs);

module.exports = router;

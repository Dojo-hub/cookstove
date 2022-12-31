const express = require("express");
const router = express.Router();
const db = require("../models/index");
const device = require("../controllers/devices/device.controller.js")

router.get("/", device.getAll);

router.get("/:id", device.getOne);

router.post("/", device.addOne);

router.put("/:id", device.updateOne);

router.delete("/:id", device.deleteOne);

router.post("/logs", device.createLog);

module.exports = router;

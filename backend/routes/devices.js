const express = require("express");
const router = express.Router();
const db = require("../models/index");
const device = require("../controllers/devices/device.controller.js");

router.get("/", device.getAll);

router.get("/:id", device.getOne);

router.get("/:id/cooking-percentages", device.getCookingPercentages);

router.post("/:id/cooking-percentages", device.createCookingPercentages);

router.put("/:id/cooking-percentages", device.updateCookingPercentages);

router.post("/", device.addOne);

router.put("/:id", device.updateOne);

router.delete("/:id", device.deleteOne);

module.exports = router;

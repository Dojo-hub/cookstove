const express = require("express");
const router = express.Router();
const db = require("../models/index");
const device = require("../controllers/devices/device.controller.js");

router.get("/", device.getAll);

router.get("/:id", device.getOne);

router.get(
  "/:id/monthly-cooking-percentages",
  device.getMonthlyCookingPercentages
);

router.put(
  "/:id/monthly-cooking-percentages",
  device.updateMonthlyCookingPercentages
);

router.post("/", device.addOne);

router.put("/:id", device.updateOne);

router.delete("/:id", device.deleteOne);

module.exports = router;

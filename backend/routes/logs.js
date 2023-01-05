const express = require("express");
const path = require("path");
const multer = require("multer");
const router = express.Router();
const device = require("../controllers/devices/device.controller.js");
const validateUser = require("../middleware/validatejwt");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/logs"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.any(), device.saveLogFile);

router.get("/:id", validateUser, device.getLogs);

module.exports = router;

const express = require("express");
const path = require("path");
const multer = require("multer");
const router = express.Router();
const device = require("../controllers/devices/device.controller.js");
const validateUser = require("../middleware/validatejwt");
const { Device } = require("../models/index");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/logs"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = async (req, file, cb) => {
  try {
    const device = await Device.findOne({
      where: {
        imei: file.originalname.substring(0, file.originalname.indexOf(".")),
      },
    });

    if (device) cb(null, true);
    else cb(null, false);
  } catch (error) {
    cb(error);
  }
};

const upload = multer({ storage, fileFilter });

router.post("/", upload.any(), device.saveLogFile);

router.post("/json", device.saveJsonLog);

router.get("/:id", validateUser, device.getLogs);

module.exports = router;

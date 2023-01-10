const express = require("express");
const router = express.Router();
const { Device, User } = require("../models/index");

router.get("/", async (req, res) => {
  try {
    const deviceCount = await Device.count();
    const userCount = await User.count();
    res.send({ userCount, deviceCount });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;

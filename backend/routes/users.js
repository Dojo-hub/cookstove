const express = require("express");
const router = express.Router();
const user = require("../controllers/user/user.controller.js");

router.get("/", user.allUsers);

router.get("/:id", user.getUser);

router.put("/:id", user.updateUser);

module.exports = router;

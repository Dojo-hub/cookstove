const express =  require("express");
const router = express.Router();
const user = require("../controllers/user/user.controller.js");
const validateUser = require("../middleware/validatejwt");

router.post("/register", user.register);

router.post("/login", user.login);

router.put("/change-password", validateUser, user.changePassword);

router.get("/profile", validateUser, user.profile);

module.exports = router;
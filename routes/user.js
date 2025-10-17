const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router= express.Router();

const userController = require("../controllers/user.js");

router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

// router.get("/signup", userController.renderSignupForm);

// router.post("/signup", wrapAsync( userController.signup));
module.exports = router;
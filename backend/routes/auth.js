var express = require("express");
var router = express.Router();
const { signout, signup, signin } = require("../controllers/auth.js");
const { check, validationResult } = require("express-validator");

router.get("/signout", signout);
router.post(
  "/signup",
  [
    check("password", "pass should be atleast 5 char").isLength({ min: 5 }),
    check("email", "enter valid email").isEmail(),
  ],
  signup
);
router.post("/signin", [check("email", "enter valid email").isEmail()], signin);

module.exports = router;

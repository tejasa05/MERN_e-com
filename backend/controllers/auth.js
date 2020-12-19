const User = require("../models/user.js");
const { check, validationResult } = require("express-validator");
var expressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");
//const cookie = require("cookie-parser");

exports.signin = (req, res) => {
  const { email, password } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array()[0].msg });
  }
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "email does not exist ",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "pass and email does not match",
      });
    }
    // create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    // token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signup = (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array()[0].msg });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "not able to save in db ",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};
exports.signout = (req, res) => {
  res.json({
    message: "user signout",
  });
};

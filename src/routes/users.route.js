const express = require("express");
const User = require("../models/user.model");
const router = express.Router();
const bcrypt = require("bcryptjs");
const _ = require("lodash");

router.post("/", async (req, res, next) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error("Login failed");
    }

    const token = user.generateJWT();

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = oneDay * 7;
    const expiryDate = new Date(Date.now() + oneWeek);

    res
      .status(200)
      .cookie("access_token", token, {
        expires: expiryDate,
        httpOnly: true,
        secure: true,
      })
      .json({
        message: "You are now logged in!",
        user: _.pick(user, ["id", "username"]),
      });
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

module.exports = router;

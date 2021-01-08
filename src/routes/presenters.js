const express = require("express");
const router = express.Router();

let presenters = [];

const createPresenter = async (req, res, next) => {
  let jumplings = req.jumplings;
  let presenters = req.presenters;

  if (jumplings.length > 0) {
    const nextPresenter =
      jumplings[Math.floor(Math.random() * jumplings.length)];
    presenters.push(nextPresenter);
    res.status(201).json(nextPresenter);
  } else {
    const error = new Error("No jumplings yet");
    error.statusCode = 400;
    next(error);
  }
};

router.post(
  "/",
  (req, res, next) => {
    req.presenters = presenters;
    next();
  },
  createPresenter
);

router.get("/", (req, res) => {
  res.status(200).json(presenters);
});

module.exports = router;

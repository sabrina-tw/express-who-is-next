const express = require("express");
const router = express.Router();
const requireJsonContent = require("../middleware/requireJsonContent");

// let jumplings = [
//   { id: 1, name: "Sabrina" },
//   { id: 2, name: "Mabel" },
//   { id: 3, name: "Elson" },
//   { id: 4, name: "Hilda" },
// ];

let jumplings = [];

router.param("id", (req, res, next, id) => {
  let jumpling = jumplings.find((jumpling) => jumpling.id === parseInt(id));
  req.jumpling = jumpling;
  next();
});

router.get("/", (req, res) => {
  res.status(200).json(jumplings);
});

router.post("/", requireJsonContent, (req, res) => {
  const newJumpling = {
    id: jumplings.length + 1,
    name: req.body.name,
  };

  jumplings.push(newJumpling);
  res.status(201).json(newJumpling);
});

router.put("/:id", requireJsonContent, (req, res, next) => {
  const jumpling = req.jumpling;

  if (jumpling) {
    req.jumpling.name = req.body.name;

    res.status(200).json(jumpling);
  } else {
    const error = new Error("Jumpling does not exist");
    error.statusCode = 400;
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  const jumpling = req.jumpling;

  if (jumpling) {
    const index = jumplings.indexOf(jumpling);
    jumplings.splice(index, 1);

    res.status(200).json(jumpling);
  } else {
    const error = new Error("Jumpling does not exist");
    error.statusCode = 400;
    next(error);
  }
});

let presenters = [];

router.post("/presenters", (req, res, next) => {
  if (jumplings.length < 1) {
    const error = new Error("No jumplings yet");
    error.statusCode = 400;
    next(error);
  } else {
    const nextPresenter =
      jumplings[Math.floor(Math.random() * jumplings.length)];
    presenters.push(nextPresenter);
    res.status(201).json(nextPresenter);
  }
});

router.get("/presenters", (req, res) => {
  res.status(200).json(presenters);
});

module.exports = router;

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

router.param("id", (req, res, next, id) => {
  let jumpling = jumplings.find((jumpling) => jumpling.id === parseInt(id));
  req.jumpling = jumpling;
  next();
});

router.put("/:id", requireJsonContent, (req, res, next) => {
  const jumpling = req.jumpling;
  req.jumpling.name = req.body.name;

  res.status(200).json(jumpling);
});

router.delete("/:id", (req, res) => {
  const jumplingId = req.params.id;
  const jumpling = jumplings.find(
    (jumpling) => jumpling.id === parseInt(jumplingId)
  );
  const index = jumplings.indexOf(jumpling);
  jumplings.splice(index, 1);

  res.status(200).json(jumpling);
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
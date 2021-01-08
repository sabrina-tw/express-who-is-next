const express = require("express");
const router = express.Router();
const requireJsonContent = require("../middleware/requireJsonContent");

let jumplings = [];

const presentersRouter = require("./presenters");
router.use(
  "/presenters",
  (req, res, next) => {
    req.jumplings = jumplings;
    next();
  },
  presentersRouter
);

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

module.exports = router;

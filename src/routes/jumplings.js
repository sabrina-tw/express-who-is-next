const express = require("express");
const router = express.Router();
const requireJsonContent = require("../middleware/requireJsonContent");
const Joi = require("joi");

let jumplings = [];

const validateJumpling = (jumpling) => {
  const schema = Joi.object({
    id: Joi.number().integer(),
    name: Joi.string().required(),
  });

  return schema.validate(jumpling);
};

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
  const idInteger = parseInt(id);
  const jumpling = jumplings.find((jumpling) => jumpling.id === idInteger);
  req.jumpling = jumpling;

  next();
});

router.get("/", (req, res) => {
  res.status(200).json(jumplings);
});

router.get("/:id", (req, res, next) => {
  const jumpling = req.jumpling;
  if (jumpling) {
    res.status(200).json(jumpling);
  } else {
    const error = new Error("Jumpling does not exist");
    error.statusCode = 404;
    next(error);
  }
});

router.post("/", requireJsonContent, (req, res, next) => {
  const newJumpling = {
    id: jumplings.length + 1,
    name: req.body.name,
  };

  const validation = validateJumpling(newJumpling);

  if (validation.error) {
    const error = new Error(validation.error.details[0].message);
    error.statusCode = 400;
    next(error);
  } else {
    jumplings.push(newJumpling);
    res.status(201).json(newJumpling);
  }
});

router.put("/:id", requireJsonContent, (req, res, next) => {
  const jumpling = req.jumpling;

  if (jumpling) {
    const jumplingRequest = { ...req.body };
    const validation = validateJumpling(jumplingRequest);

    if (validation.error) {
      const error = new Error(validation.error.details[0].message);
      error.statusCode = 400;
      next(error);
    } else {
      req.jumpling.name = req.body.name;
      res.status(200).json(jumpling);
    }
  } else {
    const error = new Error("Jumpling does not exist");
    error.statusCode = 404;
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
    error.statusCode = 404;
    next(error);
  }
});

module.exports = router;

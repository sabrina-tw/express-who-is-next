const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  const output = {
    0: "GET    /",
    1: "GET    /jumplings",
    2: "POST   /jumplings",
    3: "GET /jumplings/:id",
    4: "PUT /jumplings/:id",
    5: "DELETE /jumplings/:id",
    6: "-----------------------",
    7: "POST   /jumplings/presenters",
    8: "GET    /jumplings/presenters",
  };

  res.status(200).json(output);
});

let jumplings = [];

app.get("/jumplings", (req, res) => {
  res.status(200).json(jumplings);
});

app.post("/jumplings", (req, res) => {
  const newJumpling = {
    id: jumplings.length + 1,
    name: req.body.name,
  };

  jumplings.push(newJumpling);
  res.status(201).json(newJumpling);
});

app.put("/jumplings/:id", (req, res) => {
  const jumplingId = req.params.id;
  const jumpling = jumplings.find(
    (jumpling) => jumpling.id === parseInt(jumplingId)
  );

  jumpling.name = req.body.name;

  res.status(200).json(jumpling);
});

app.delete("/jumplings/:id", (req, res) => {
  const jumplingId = req.params.id;
  const jumpling = jumplings.find(
    (jumpling) => jumpling.id === parseInt(jumplingId)
  );
  const index = jumplings.indexOf(jumpling);
  jumplings.splice(index, 1);

  res.status(200).json(jumpling);
});

let presenters = [];

app.post("/jumplings/presenters", (req, res, next) => {
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

app.get("/jumplings/presenters", (req, res) => {
  res.status(200).json(presenters);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = app;

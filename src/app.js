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

module.exports = app;

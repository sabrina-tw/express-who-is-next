const express = require("express");
const app = express();

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

module.exports = app;

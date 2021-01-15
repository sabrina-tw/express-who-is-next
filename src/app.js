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

const jumplingsRouter = require("./routes/jumplings.route");
app.use("/jumplings", jumplingsRouter);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if ((err.name = "ValidationError")) err.statusCode = 400;
  res.status(err.statusCode).json({ message: err.message });
});

module.exports = app;

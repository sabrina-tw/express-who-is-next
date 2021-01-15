const express = require("express");
const router = express.Router();
const requireJsonContent = require("../middleware/requireJsonContent");
const ctrl = require("../controllers/jumplings.controller");

router.get("/", ctrl.getAllJumplings);

router.get("/presenter", ctrl.getRandomJumpling);

router.get("/:name", ctrl.getJumplingByName);

router.post("/", requireJsonContent, ctrl.addJumpling);

router.put("/:id", requireJsonContent, ctrl.updateJumpling);

// router.delete("/:id")

module.exports = router;

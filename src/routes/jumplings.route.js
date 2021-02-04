const express = require("express");
const router = express.Router();
const requireJsonContent = require("../middleware/requireJsonContent");
const ctrl = require("../controllers/jumplings.controller");
const auth = require("../middleware/auth");

router.get("/", ctrl.getAllJumplings);

router.get("/presenter", ctrl.getRandomJumpling);

router.get("/:name", ctrl.getJumplingByName);

router.post("/", [auth.required, requireJsonContent], ctrl.addJumpling);

router.put("/:id", requireJsonContent, ctrl.updateJumpling);

router.delete("/:id", ctrl.deleteJumpling);

module.exports = router;

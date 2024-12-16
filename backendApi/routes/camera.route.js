const express = require("express");
const router = express.Router();
const Controller = require("../controllers/camera.controller");
const { verifyAccessToken } = require("../Helpers/jwt_helper");

router.post("/", verifyAccessToken, Controller.create);

router.get("/:id", verifyAccessToken, Controller.get);

router.get("/", verifyAccessToken, Controller.list);

router.put("/:id", verifyAccessToken, Controller.update);

router.delete("/:id", verifyAccessToken, Controller.delete);

router.put("/:id/restore", verifyAccessToken, Controller.restore);

module.exports = router;

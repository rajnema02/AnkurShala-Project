const router = require("express").Router();
const Controller = require("../controllers/teacherSchedule.controller");
const { verifyAccessToken } = require("../Helpers/jwt_helper");

router.post("/", Controller.create);

// router.get("/:id", Controller.get);

router.get("/", Controller.list);

// router.put("/:id", Controller.update);

router.delete("/:id", Controller.delete);

router.get("/search", Controller.search);

module.exports = router;

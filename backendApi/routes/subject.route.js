const router = require("express").Router();
const Controller = require("../controllers/subject.controller");
const { verifyAccessToken } = require("../Helpers/jwt_helper");

router.post("/", Controller.create);

router.get("/classlistForTeacher", Controller.classlistForTeacher);

router.get("/:id", Controller.get);

router.get("/classId/:id", Controller.getByClass);

router.get("/", Controller.list);

router.put("/:id", Controller.update);

router.delete("/:id", Controller.delete);


module.exports = router;

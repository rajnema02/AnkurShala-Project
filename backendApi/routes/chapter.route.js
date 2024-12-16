const router = require("express").Router();
const Controller = require("../controllers/chapter.controller");
const { verifyAccessToken } = require("../Helpers/jwt_helper");

router.post("/", Controller.create);

router.get("/:id", Controller.get);

router.get("/subjectId/:id", Controller.getBySubject);

router.get("/", Controller.list);

router.put("/:id", Controller.update);

router.delete("/:id", Controller.delete);


module.exports = router;

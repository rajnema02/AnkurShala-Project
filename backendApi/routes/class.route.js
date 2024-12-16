const router = require("express").Router();
const Controller = require("../controllers/class.controller");
const { verifyAccessToken } = require("../Helpers/jwt_helper");

router.post("/", Controller.create);

router.get("/:id", Controller.get);

router.get("/", Controller.list);

router.put("/:id", Controller.update);

router.delete("/:id", Controller.delete);


module.exports = router;

const router = require("express").Router();
const scheduleController = require("../controllers/scheduleRequest.controller");

router.post('/', scheduleController.createScheduleRequest);

module.exports= router;
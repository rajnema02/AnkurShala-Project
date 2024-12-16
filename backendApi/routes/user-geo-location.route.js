const express = require('express');
const router = express.Router();
const userGeoLocationController = require('../controllers/user-geo-location.controller');
const { verifyAccessToken } = require("../Helpers/jwt_helper");

router.get('/', verifyAccessToken, userGeoLocationController.list);

router.get('/:id', verifyAccessToken, userGeoLocationController.get);

router.post('/', verifyAccessToken, userGeoLocationController.create);

module.exports = router;

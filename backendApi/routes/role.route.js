const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { verifyAccessToken } = require("../Helpers/jwt_helper");

router.get('/', verifyAccessToken, roleController.list);

router.get('/:id', verifyAccessToken, roleController.get);

router.post('/', verifyAccessToken, roleController.create);

router.put('/:id', verifyAccessToken, roleController.update);

router.delete('/:id', verifyAccessToken, roleController.delete);

module.exports = router;

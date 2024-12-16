const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyAccessToken } = require("../Helpers/jwt_helper");

router.get('/', verifyAccessToken, productController.list);

router.get('/:id', verifyAccessToken, productController.get);

router.post('/', verifyAccessToken, productController.create);

router.put('/:id', verifyAccessToken, productController.update);

router.delete('/:id', verifyAccessToken, productController.delete);

module.exports = router;

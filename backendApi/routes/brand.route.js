const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const { verifyAccessToken } = require('../Helpers/jwt_helper');

// Route to get all categories
router.get('/', verifyAccessToken, brandController.listBrands);

router.get('/:id', verifyAccessToken, brandController.getBrandById);

// Route to create a new category
router.post('/', verifyAccessToken, brandController.createBrand);

// Route to update a category by ID
router.put('/:id', verifyAccessToken, brandController.updateBrandById);

module.exports = router;

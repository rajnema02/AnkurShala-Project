const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { verifyAccessToken } = require('../Helpers/jwt_helper');

// Route to get all categories
router.get('/', verifyAccessToken, categoryController.listCategories);

// Route to get category By Id
router.get('/:id', verifyAccessToken, categoryController.getCategoryById);

// Route to create a new category
router.post('/', verifyAccessToken, categoryController.createCategory);

// Route to update a category by ID
router.put('/:id', verifyAccessToken, categoryController.updateCategoryById);

module.exports = router;

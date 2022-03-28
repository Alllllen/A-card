const express = require('express');
const router = express.Router();

const authController = require('./../controllers/authController');
const tagController = require('./../controllers/tagController');

// router.use(authController.protect);
router.route('/:id').get(tagController.getTag);
router.route('/').post(authController.protect, tagController.createTag);

module.exports = router;

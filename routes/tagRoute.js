const express = require('express');
const router = express.Router();
const postRoute = require('./../routes/postRoute');
const authController = require('./../controllers/authController');
const tagController = require('./../controllers/tagController');

// router.use('/tag/:tagId/', postRoute);
router
  .route('/')
  .get(tagController.getAllTag)
  .post(authController.protect, tagController.createTag);

router
  .route('/:id')
  .get(tagController.getTag)
  .delete(authController.protect, tagController.deleteTag);

module.exports = router;

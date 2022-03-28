const express = require('express');
const router = express.Router();

const authController = require('./../controllers/authController');
const postController = require('./../controllers/postController');

router
  .route('/')
  .get(postController.getAllPosts)
  .post(
    authController.protect,
    postController.setUserIds,
    postController.createPost
  );

module.exports = router;

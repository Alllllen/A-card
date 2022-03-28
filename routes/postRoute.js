const express = require('express');
const router = express.Router();

const commentRoute = require('./../routes/commentRoute');

const authController = require('./../controllers/authController');
const postController = require('./../controllers/postController');

router.use('/:postId/comments', commentRoute);

router
  .route('/')
  .get(postController.getAllPosts)
  .post(
    authController.protect,
    postController.setUserIds,
    postController.createPost
  );

router
  .route('/:id')
  .get(postController.getPost)
  .patch(
    authController.protect,
    postController.setUserIds,
    postController.updatePost
  )
  .delete(
    authController.protect,
    postController.setUserIds,
    postController.deletePost
  );

module.exports = router;

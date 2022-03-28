const express = require('express');

const authController = require('./../controllers/authController');
const commentController = require('./../controllers/commentController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protect,
    commentController.setUserIds,
    commentController.createComment
  );

router
  .route('/:id')
  .get(commentController.getComment)
  .patch(
    authController.protect,
    commentController.setUserIds,
    commentController.updateComment
  )
  .delete(
    authController.protect,
    commentController.setUserIds,
    commentController.deleteComment
  );

module.exports = router;

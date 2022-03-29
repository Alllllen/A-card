const express = require('express');
const router = express.Router();
const postRoute = require('./../routes/postRoute');
const authController = require('./../controllers/authController');
const boardController = require('./../controllers/boardController');

// router.use('/tag/:tagId/', postRoute);
router
  .route('/')
  .get(boardController.getAllBoard)
  .post(authController.protect, boardController.createBoard);

router
  .route('/:id')
  .get(boardController.getBoard)
  .delete(authController.protect, boardController.deleteBoard);

module.exports = router;

const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use(viewsController.alerts);
router.use(viewsController.getSideBar);
router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get(
  '/overview/:id',
  authController.isLoggedIn,
  viewsController.getOverview
);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/regist', authController.isLoggedIn, viewsController.getRegistForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/writePost', authController.protect, viewsController.getPostform);
router.get('/cards', authController.protect, viewsController.getCard);
router.get('/messages', authController.protect, viewsController.getMessage);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );

router.get('/posts/:id', authController.isLoggedIn, viewsController.getPost);
router.get(
  '/boards/:id',
  authController.isLoggedIn,
  viewsController.getBoardPost
);
router.get(
  '/messages/:id',
  authController.isLoggedIn,
  viewsController.getBoardPost
);

module.exports = router;

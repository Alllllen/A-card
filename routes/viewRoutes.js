const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use(viewsController.alerts);
router.use(viewsController.getSideBar);
router.get('/', authController.isLoggedIn, viewsController.getOverview);

// router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/regist', authController.isLoggedIn, viewsController.getRegistForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/writePost', authController.protect, viewsController.getPostform);

// router.get('/my-tours', authController.protect, viewsController.getMyTours);

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

module.exports = router;

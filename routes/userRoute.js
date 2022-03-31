const express = require('express');
const router = express.Router();

const authController = require('./../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/protect', authController.protect);

router.get(
  '/me',
  authController.protect,
  authController.getMe,
  authController.getUser
);

router.patch(
  '/updateMe',
  authController.protect,
  authController.getMe,
  authController.updateUser
);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

module.exports = router;

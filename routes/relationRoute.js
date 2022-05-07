const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const relationController = require('./../controllers/relationController');

router.post(
  '/agreeRelation',
  authController.protect,
  relationController.agreeRelation
);
router.post(
  '/disagreeRelation',
  authController.protect,
  relationController.disagreeRelation
);
router.get(
  '/makepair',
  relationController.clearPair,
  relationController.makePair
);

module.exports = router;

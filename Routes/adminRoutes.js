const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

router.get(
  '/getAllReportPost',
  authController.protect,
  adminController.getAllReportPost
);
router.post(
  '/deleteReportPost',
  authController.protect,
  adminController.deleteReportPost
);

router.post(
  '/deleteClient',
  authController.protect,
  adminController.DeleteClient
);

router.get(
  '/getAllHelpMe',
  authController.protect,
  adminController.getAllHelpMe
);
router.post(
  '/deleteHelpMe',
  authController.protect,
  adminController.deleteHelpMe
);

// router.get('/paidUsers', authController.protect, adminController.paidUsers);
// router.get('/unPaidUsers', authController.protect, adminController.unPaidUsers);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

router.get('/getAllReportPost',authController.protect,adminController.getAllReportPost);
router.post('/deleteReportPost',authController.protect,adminController.deleteReportPost);


module.exports = router;
const express = require('express');
const router = express.Router();
const PaymentController = require("../controllers/paymentControlller")

router.route('/credit').post(PaymentController.initiateCredit)
router.route('/callbackCredit').post(PaymentController.callback)

router.route('/wallet').post(PaymentController.initiateWallet)

module.exports = router
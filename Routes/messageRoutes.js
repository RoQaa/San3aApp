const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');
const express = require('express')
const router = express.Router()

router.route('/sendMessage').post(authController.protect,messageController.sendMessage)
router.route('/getAllMessages').post(authController.protect,messageController.allMessages)
//router.route('/deleteMessageForAll').delete(authController.protect,messageController.deleteMessageForAll)

module.exports = router
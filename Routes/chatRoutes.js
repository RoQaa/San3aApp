const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();
const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "./uploads")
    },
    filename:(req,file,cb) =>{
        cb(null, Date.now() + ".jpg")
    },
})
const upload = multer({
    storage:storage
})

router.route('/addimage').post(upload.single("img"),(req,res)=>{
    try{
        res.json({path: req.file.filename})
    }catch(e){
        return res.json({error:e})
    }
})

router.route('/getOneChat').post(authController.protect,chatController.accesOrCreateChat)
router.route('/getAllChats').get(authController.protect,chatController.allChats)
router.route('/deleteAllChats').post(authController.protect,chatController.deleteAllChats)
router.route('/deleteChat').post(authController.protect,chatController.deleteChat)
router.route('/filterChat').post(authController.protect,chatController.filterChat)

module.exports = router
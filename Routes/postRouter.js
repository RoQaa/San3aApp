const express = require('express');
const router = express.Router();
const authController = require(`${__dirname}/../controllers/authController`);
const postController = require('../controllers/postController');

router.post('/addPost',authController.protect,postController.addPost);
router.post('/deletePost',authController.protect,postController.deletePost);
router.post('/UpdatePost',authController.protect,postController.updatePost);
router.post('/reportPost',authController.protect,postController.ReportPost);

router.get('/SavedPosts',authController.protect,postController.getSavedPosts);
router.post('/SavePost',authController.protect,postController.AddSavedPost);
router.post('/DeleteSavedPost',authController.protect,postController.DeleteSavedPost);
router.post('/getPostById',postController.getPostById);

router.get('/postTimeLine',authController.protect,postController.getPosts);
router.post('/profilePage',postController.getProfilePage);
router.get('/myProfilePage',authController.protect,postController.getMyProfilePage);


module.exports = router;
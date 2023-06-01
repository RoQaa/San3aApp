const express=require('express');
const router=express.Router();
const tourController=require('../controllers/tourController');
const authController=require(`${__dirname}/../controllers/authController`);

//  router.param('id',tourController.checkId);
router.route('/stats-Tours').get(tourController.getTourStats);
router.route('/monthly-Plan/:year').get(tourController.getMonthlyPlan);
router.route('/top-5-Tours')
.get(tourController.aliasTop5,tourController.GetAllTours)
  router.route('/')
  .get(authController.protect,tourController.GetAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.GetTour)
  .patch(tourController.UpdateTour)
  .delete(authController.protect,authController.restrictTo('admin'),tourController.DeleteTour);
  module.exports=router;
  //sdfsa
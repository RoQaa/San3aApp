const User = require('../models/userModel');
const HelpMe = require('../models/helpMe');
const ReportPost = require('../models/reportPostModel');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require(`../utils/appError`);

exports.getAllReportPost = catchAsync(async (req, res, next) => {
  const AllReportPost = await ReportPost.find()
    .sort({reportedAt:1})
    .populate({
      path: 'postId',
      select: '-updatedAt',
    })
    .populate({
      path: 'userId',
      select: 'name email',
    });
  if (!AllReportPost) {
    return next(new AppError("Can't find Reports posts", 404));
  }

  res.status(200).json({
    status: true,
    message: 'AllReportPost return Sucessfully',
    date: AllReportPost,
  });
});

exports.deleteReportPost = catchAsync(async (req, res, next) => {
  const deleteReportPost = await ReportPost.findByIdAndDelete(
    req.body.reportId
  );

  if (!deleteReportPost) {
    return next(new AppError("Can't delete ReportPost", 404));
  }

  res.status(200).json({
    status: true,
    message: 'ReportPost deleted Sucessfully',
  });
});

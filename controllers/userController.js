const User = require(`${__dirname}/../models/userModel`);
const Post = require(`${__dirname}/../models/postModel`);
const HelpMe = require('../models/helpMeModel');
const { catchAsync } = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const uploadImage = require('../utils/uploadImage');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: 'customer' })
  .select(
    'name photo rateAverage '
  );
  res.status(200).json({
    length:users.length,
    status: true,
    message:'all customers sent successfully',
    data: users,
  });
});

exports.getAllWorkers = catchAsync(async (req, res, next) => {
  if (!req.body.job) {
    const users = await User.find({ role: 'worker' }).select(
      'name photo rateAverage bio'
    );

    res.status(200).json({
      length: users.length,
      message:'all workers sent successfully',
      status: true,
      data: users,
    });
  }
  if (req.body.job) {
    const users = await User.find({ job: req.body.job }).select(
      'name photo rateAverage bio'
    );

    res.status(200).json({
      length: users.length,
      message:"All worker send successfully",
      status: true,
      data: users,
    });
  }
});

TODO: exports.UpdatedUser = catchAsync(async (req, res, next) => {
  if (req?.files?.photo) {
    const file = req.files.photo;

    req.body.photo = await uploadImage(file.tempFilePath);
  }
  const filterBody = filterObj(req.body, 'name', 'email', 'photo', 'bio');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: true,
    user: updatedUser,
  });
});

exports.deletedMe = catchAsync(async (req, res, next) => {
  //protect handler
  await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    {
      new: true,
      runValidators: true,
    }
  );
  await Post.findOneAndUpdate({ user: req.user.id }, { Activity: false });
  res.status(204).json({
    status: true,
    message: 'deleted successfully',
    data: null,
  });
});

exports.GetUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('user not found', 404));
  }
  res.status(200).json({
    status: true,
    data: {
      user: user,
    },
  });
});

exports.AddWorkerUserRate = catchAsync(async (req, res, next) => {
  //protect handler
  const userLog=req.user;
  const rate = req.body.rate;
  const user = await User.findByIdAndUpdate(
    req.body.id,
    {
      $push: { rating: rate },
      $push:{rates:userLog.id}
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    return next(new AppError("there's no user with that id", 404));
  }

  user.rateAverage = user.changesRateAvg(user.rating);
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: true,
    message: 'rate added success',
    data: user,
  });
});

exports.helpMe = catchAsync(async (req, res, next) => {
  
  if (!req.body.description) {
    return next(new AppError(' must declare your problem', 400));
  }

  if (req?.files?.image) {
    const files = req.files.image;

    if (files.length === undefined) {
      req.body.image = [await uploadImage(files.tempFilePath)];
    } else {
      const imagesToCloudinary = files.map((data) => {
        // missing return statement
        return uploadImage(data.tempFilePath);
      });
      let imageResponses = await Promise.all(imagesToCloudinary);

      req.body.image = imageResponses.slice(); // like push in array

      // req.body.image = await uploadImage(file.tempFilePath);
    }
  }

  if (!req?.files?.image) {
    req.body.image = [];
  }

  const now = new Date();
  const sendingDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  
  req.body.userId = req.user._id;
  req.body.Date = sendingDate

  const helpMe = await HelpMe.create(req.body);
  
  if (!helpMe) {
    return next(new AppError("Can't create HelpMe ", 404));
  }

  res.status(200).json({
    status: true,
    message: 'HelpMe sent Sucessfully',
  });

});

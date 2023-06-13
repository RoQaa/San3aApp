const Post = require('./../models/postModel');
const User = require('./../models/userModel');
const { catchAsync } = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`../utils/appError`);
const uploadImage = require('../utils/uploadImage');
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.addPost = catchAsync(async (req, res, next) => {
  //protect handler
  const user = req.user._id;
  if (!user) {
    return next(new AppError("Please log in first", 404));
  }

  if (req?.files?.image) {
    const file = req.files.image;

    req.body.image = await uploadImage(file.tempFilePath);
  }
  if (!req?.files?.image) {
    req.body.image = null;
  }
  req.body.user = user;
  const newPost = await Post.create(req.body);
  res.status(200).json({
    status: true,
    message: 'Post Created Sucessfully',
    
  });
});
exports.getPostById=catchAsync(async(req,res,next)=>{
  const post =await Post.findById(req.body.postId);
  if(!post){
    return next(new AppError("there's no post with that id",404));
  }
  res.status(200).json({
    status:true,
    message:"Post Returned Sucessed",
    data:post
  })
})
exports.getPosts = catchAsync(async (req, res, next) => {
  //protect handler
  const data = req.user;
 if(!req.body.job){
  let allPosts = await Post.find({ user: { $ne: data._id } }).sort('-updatedAt');
  if(!allPosts){
    return next(new AppError("there's n post to get",404));
  }
  let filteredPosts = allPosts.filter((post) => post.user.role !== 'worker');
  

  if (!filteredPosts) {
    return next(new AppError("there's no posts to Get ", 404));
  }
  let posts = filteredPosts.sort(function () {
    return Math.random() - 0.5;
  });
  res.status(200).json({
    length: posts.length,
    status: true,
    isPaid:data.isPaid,
    data: posts,
  });
 }
 if(req.body.job){
  
  let allPosts = await Post.find({ user: { $ne: data._id } }).find({job:req.body.job}).sort('-updatedAt');
  
  if(!allPosts){
    return next(new AppError("there's n post to get",404));
  }

  let filteredPosts = allPosts.filter((post) => post.user.role !== 'worker');

  if (!filteredPosts) {
    return next(new AppError("there's no posts to Get ", 404));
  }
  let posts = filteredPosts.sort(function () {
    return Math.random() - 0.5;
  });
  res.status(200).json({
    length: posts.length,
    status: true,
    isPaid:data.isPaid,
    data: posts,
  });
 }
 });

exports.deletePost = catchAsync(async (req, res, next) => {
  //protect handler
  const user =req.user;
  
  if(req.body.userId!==user.id || !req.body.userId){
    return next(new AppError("You don't have access to this operation",401));
  }
  const deletePost = await Post.findByIdAndDelete(req.body.postId);

  if (!deletePost) {
    return next(new AppError('No post found with that ID', 404));
  }
  res.status(200).json({
    status: true,
    message: 'Deleted sucessfully',
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  //protect Handler
  const user =req.user;
  
  if(req.body.userId!==user.id || !req.body.userId){
    return next(new AppError("u don't have access to this operation",401));
  }
  if (req?.files?.image) {
    const file = req.files.image;

    req.body.image = await uploadImage(file.tempFilePath);
  }
  const filterBody = filterObj(req.body, 'image', 'description');
  const post = await Post.findByIdAndUpdate(req.body.postId, filterBody, {
    runValidators: true,
    new: true,
  }); //post id
  if (!post) {
    return next(new AppError("there's no post with that id ", 404));
  }
  res.status(200).json({
    status: true,
    message: 'post updated Successfully',
    
  });
});

exports.getProfilePage = catchAsync(async (req, res, next) => {
  // post id from client
  let userData = await User.findById(req.body.usId).select('name email countryCode  city birthdate role photo rateAverage');
  if (userData.role === 'user') {
    userData.birthdate = null;
  }
  const posts = await Post.find({ user: userData.id });
  res.status(200).json({
    status: true,
    data: {
      userData,
      posts,
    },
  });
});

exports.getMyProfilePage = catchAsync(async (req, res, next) => {
  // protectHandler
  const user = req.user;
  const userData=await User.findById(user.id).select('name email countryCode isPaid city birthdate role photo rateAverage');
  if (userData.role === 'customer') {
    userData.birthdate = null;
  }
  const posts = await Post.find({ user: userData.id });
  res.status(200).json({
    status: true,
    data: {
      userData,
      posts,
    },
  });
});
exports.AddSavedPost=catchAsync(async(req,res,next)=>{
  //postHandler
  const user=req.user;
  //body=> post Id
   const addSavedPost=await Post.findByIdAndUpdate(req.body.postId,{$push:{SavedById:user.id}})
   if(!addSavedPost){
    return next(new AppError("there's no post to add"),404);
   }
   res.status(200).json({
    status:true,
    message:"Post Saved Successfully"
   })
});
exports.DeleteSavedPost=catchAsync(async(req,res,next)=>{
  //Portect handler
  const user=req.user;
  const deletePost=await Post.findByIdAndUpdate(req.body.postId,{$pull:{SavedById:user.id}});
  if(!deletePost){
    return next(new AppError("there's no post to deleted",404));

  }
  res.status(200).json({
    status:true,
    message:"Post Deleted Successfully"
})
})

exports.getSavedPosts=catchAsync(async(req,res,next)=>{
  //ProtectHandler
  const user=req.user;
  const AllSavedPosts= await Post.aggregate([
    {
      $unwind:'$SavedById'
    },
     {
       $match:{
        SavedById:user.id,
       }
     },

     {
     $lookup:
    {
        from: User.collection.name,
        localField: "user",
        foreignField: "_id",
        pipeline: [ {$project: {
          name: 1,
        //  photo:1
        }, } ],
        as: "userData"
    }
    },
    {
      $project:{
        user:0,
        createdAt:0,
        updatedAt:0,
        __v:0,
      }
    }
  ])
  if(!AllSavedPosts){
    return next(new AppError("There's no Saved Posts"),404);
  }
  if(AllSavedPosts.length===0){
    return next(new AppError("There's no Saved Posts"),404);
  }
  res.status(200).json({
    status:true,
    length:AllSavedPosts.length,
    message:"saved Posts returned Successfully",
    data:AllSavedPosts
  })
})

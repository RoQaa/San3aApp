const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError')
const {catchAsync} = require('../utils/catchAsync')

exports.accesOrCreateChat = catchAsync(async(req, res, next)=>{

    const reciver = await User.findById(req.body.id)
    
    if(!reciver){
      return next(new AppError('No user found with that id',404))
    }

    var isChat = await Chat.find({to: reciver.id})
    
    if(isChat.length > 0){
      
      const idString = isChat[0]._id.toString();
      const messages = await Message.find({ chat: idString })

      res.status(200).json({
          status: true,
          message:"Access successfully",
          chatID: isChat.id,
          data: messages
      }); 

    }else{
        var chat = {
            to:reciver.id,
            from:req.user.id
        }
        try{
            const newChat = await Chat.create(chat);
            
            res.status(200).json({
                status: true,
                message:"chat creatad successfully",
                chatID:newChat.id,
                data: null, 
            }); 
        }catch(err){
            return next(new AppError(err.message, 400))
        }
    }
})

exports.allChats = catchAsync(async(req, res, next)=>{

    var chats = await Chat.find({ $and: [{ latestMessage: { $ne: null}},{ $or: [{ to: req.user.id }, {from: req.user.id }]}]})
                          .select("-from")
                          .populate({
                            path:'to',
                            select:'name photo'
                          })
                          .populate({
                            path:'latestMessage',
                            select:'content'
                          })
                          .sort('-createdAt')

    if(!chats){
        return next(new AppError("Not Found Chats",404))
    }

    res.status(200).json({
        status: true,
        message:"All chat sent successfully",
        data: chats
    }); 
})

exports.deleteAllChats = catchAsync(async(req, res, next)=>{
  const chat = Chat.deleteMany({ $or: [{ to: req.user.id }, {from: req.user.id }]})
  
  if(!chat){
    return next(new AppError('Sorry, Cannot delete chats',404))
  }
  res.status(204).json({
    status:true,
    data: null
  })
})

exports.deleteChat = catchAsync(async(req, res, next)=>{
  const chat = Chat.findByIdAndDelete(req.body.id)
  if(!chat){
    return next(new AppError('Sorry, No chat exist with this id ', 404))
  }
  res.status(204).json({
    status:true,
    message:"deleted successfully",
    data: null
  })
})
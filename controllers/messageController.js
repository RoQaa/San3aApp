const Message = require('../models/messageModel')
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError')
const uploadImage=require('../utils/uploadImage');
const {catchAsync} = require('../utils/catchAsync')

exports.sendMessage = catchAsync(async(req, res, next)=>{

  

  if(!req.body.chatId){
    return next(new AppError("Invalid data passed into request"))
  }

  if(!req.body.text){
    req.body.text = null
  }

  if(req?.files?.image){
    const file = req.files.image;
    req.body.image = await uploadImage(file.tempFilePath);
  }
  if (!req?.files?.image) {
    req.body.image = null;
  }
    
  const now = new Date();
  const sendingDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const sendingtime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  
  var newMessage = {
    sender: req.user._id,
    text: req.body.text,
    image: req.body.image,
    chat: req.body.chatId,
    time: sendingtime,
    date: sendingDate,
  };

  try{

    const message = await Message.create(newMessage)
        
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })
    await Chat.findByIdAndUpdate(req.body.chatId, { date: sendingDate })
    await Chat.findByIdAndUpdate(req.body.chatId, { time: sendingtime })  
    
    res.status(200).json({
        status: true,
        message:"message sent successfully",
        data:{sender:message.sender,
          content:{
            text:message.text,
            image:message.image
          },
          chat:message.chatId,
          time:message.time,
          date:message.data
        }
    })  
    
  }catch(err){
    return next(new AppError("cannot send message", 400))
  }
})

exports.allMessages = catchAsync(async(req, res, next)=>{
 
    const messages = await Message.find({ chat: req.body.chatId})
                                  .select("-chat")
                                  .sort({ time: 1 })
                                  .sort({ date: 1 })                              

    if(!messages){
        return next(new AppError(`Sorry, can't found messages belongs to this chat `, 400))
    }                

    res.status(200).json({
        status: true,
        message:"All Messages sent successfully",
        data: messages
    })
})
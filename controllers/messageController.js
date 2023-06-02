const Message = require('../models/messageModel')
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError')
const {catchAsync} = require('../utils/catchAsync')

exports.sendMessage = catchAsync(async(req, res, next)=>{
  const {chatId, content} = req.body;

  if(!chatId || !content){
    return next(new AppError("Invalid data passed into request"))
  }  

  const now = new Date();
  const sendingtime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });           
  console.log(`The Message was sent at ${sendingtime}.`)

  let count = 0;

  const interval = setInterval(() => {

    count++;
    console.log('textMessage', `This is text message sent from ${count} minute.`)

    if (count >= 2) {
      clearInterval(interval);
      console.log('textMessage', `The textMessage was sent at ${sendingtime}.`);
    }
  }, 60000); // send message every 60 seconds

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    timestamps: Date.now(),
  };

  try{

    const message = await Message.create(newMessage)
        
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message })  
    
    res.status(200).json({
        status: true,
        message:"message sent successfully",
    })  
    
  }catch(err){
    return next(new AppError("cannot send message", 400))
  }
})

exports.allMessages = catchAsync(async(req, res, next)=>{
 
    const messages = await Message.find({ chat: req.body.chatId} , null,{ sort :{timestamp: 1 }})
                                  .select("-chat")                              

    if(!messages){
        return next(new AppError(`Sorry, can't found messages belongs to this chat `, 400))
    }                

    res.status(200).json({
        status: true,
        message:"All Messages sent successfully",
        data: messages
    })
})
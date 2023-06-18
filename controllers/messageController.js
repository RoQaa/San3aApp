const Message = require('../models/messageModel')
const Chat = require('../models/chatModel');
const AppError = require('../utils/appError')
const uploadImage=require('../utils/uploadImage');
const {catchAsync} = require('../utils/catchAsync')

exports.sendMessage = catchAsync(async(req, res, next)=>{

  if(!req.body.chatId){
    return next(new AppError("Invalid data passed into request"))
  }

  if(!req.body.text){
    req.body.text = ""
  }

  if(req?.files?.image){
    const file = req.files.image;
    req.body.image = await uploadImage(file.tempFilePath);
  }
  if (!req?.files?.image) {
    req.body.image = "";
  }
    
  const now = new Date();
  const sendingDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const sendingtime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
  
  var newMessage = {
    sender: req.user._id,
    text: req.body.text,
    image: req.body.image,
    chat: req.body.chatId,
    time: sendingtime,
    date: sendingDate,
  };

  const chat = await Chat.findById(req.body.chatId)
  var deleteFrom = ""
  var deleteTo = ""

  if(chat.deleteFrom !== null){
    await Chat.findByIdAndUpdate(req.body.chatId,{
      deleteFrom : null,
      rechatTimeFrom : sendingtime ,
      rechatDateFrom : sendingDate
    })  
    // deleteFrom = chat.deleteFrom.toString()
    // if(deleteFrom === req.user.id){
    //   await Chat.findByIdAndUpdate(req.body.chatId,{
    //     deleteFrom : null,
    //     rechatTimeFrom : sendingtime ,
    //     rechatDateFrom : sendingDate
    //   })  
    // }  
  }else if(chat.deleteTo !== null){
    await Chat.findByIdAndUpdate(chat._id,{
      deleteTo : null,
      rechatTimeTo : sendingtime ,
      rechatDateTo : sendingDate
    }) 
    // deleteTo = chat.deleteTo.toString()
    // if(deleteTo === req.user.id){
    //   await Chat.findByIdAndUpdate(chat._id,{
    //     deleteTo : null,
    //     rechatTimeTo : sendingtime ,
    //     rechatDateTo : sendingDate
    //   })  
    // }
  }
 
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
 
    const chat = await Chat.findById(req.body.chatId)

    if(!chat){
      return next(new AppError('No chat found with that id',404))
    }

    var deleteFrom = ""
    var deleteTo = ""
    if(chat.deleteFrom !== null){
      deleteFrom = chat.deleteFrom.toString()
    }else if(chat.deleteTo !== null){
      deleteTo = chat.deleteTo.toString()
    }

    if(deleteFrom === req.user.id || deleteTo === req.user.id){

      res.status(200).json({
        status: true,
        message:"Access successfully",
        chatID: chat._id,
        data: []
      });

    }else{

      if(chat.from.toString() === req.user.id && chat.rechatDateFrom !== null){

        const messages = await Message.find({$and: [{ chat: req.body.chatId},
          { date:{$gte:chat.rechatDateFrom}},{ time:{$gte:chat.rechatTimeFrom}}]})
                                      .select("-chat")
                                      .sort({ time: 1 })
                                      .sort({ date: 1 }) 
        
        if(!messages){
            return next(new AppError(`Sorry, can't found messages belongs to this chat `, 400))
        }                

        res.status(200).json({
            status: true,
            message:"All Messages sent successfully",
            chatID: chat._id,
            data: messages
        })

      }else if(chat.from.toString() === req.user.id && chat.rechatDateTo !== null){
        
        const messages = await Message.find({chat: req.body.chatId})
                                    .select("-chat")
                                    .sort({ time: 1 })   
                                    .sort({ date: 1 }) 
                                                          
        if(!messages){
            return next(new AppError(`Sorry, can't found messages belongs to this chat `, 400))
        }                

        res.status(200).json({
            status: true,
            message:"All Messages sent successfully",
            chatID: chat._id,
            data: messages
        })

      }else if(chat.to.toString() === req.user.id && chat.rechatDateTo !== null){

        const messages = await Message.find({$and: [{ chat: req.body.chatId},
          { date:{$gte:chat.rechatDateTo}},{ time:{$gte:chat.rechatTimeTo}}]})
                                      .select("-chat")
                                      .sort({ time: 1 })
                                      .sort({ date: 1 })     
                                                      
        if(!messages){
        return next(new AppError(`Sorry, can't found messages belongs to this chat `, 400))
        }                

        res.status(200).json({
        status: true,
        message:"All Messages sent successfully",
        chatID: chat._id,
        data: messages
        })

      }else if(chat.to.toString() === req.user.id && chat.rechatDateFrom !== null){
        
        const messages = await Message.find({chat: req.body.chatId})
                                    .select("-chat")
                                    .sort({ date: 1 }) 
                                    .sort({ time: 1 })                              
        if(!messages){
            return next(new AppError(`Sorry, can't found messages belongs to this chat `, 400))
        }                

        res.status(200).json({
            status: true,
            message:"All Messages sent successfully",
            chatID: chat._id,
            data: messages
        })

      }else{

        const messages = await Message.find({chat: req.body.chatId})
                                    .select("-chat")
                                    .sort({ time: 1 })   
                                    .sort({ date: 1 }) 
                                                          
        if(!messages){
            return next(new AppError(`Sorry, can't found messages belongs to this chat `, 400))
        }                

        res.status(200).json({
            status: true,
            message:"All Messages sent successfully",
            chatID: chat._id,
            data: messages
        })
      }
    }  
})

// exports.deleteMessageForAll = catchAsync(async(req, res, next)=>{
//   const message = await Message.findByIdAndUpdate(req.body.msgId, {text: null, image: null},{
//     runValidators: true,
//     new: true,
//   })
//   if(!message){
//     return next("No message found with this id",404)
//   }
//   res.status(200).json({
//     status:true,
//     message:"deleted successfully",
//   })
// }) 

exports.deleteMessagesAndChat = catchAsync(async(req,res,next)=>{
  const chat = await Chat.findByIdAndDelete(req.body.chatId)
  if(!chat){
    return next(new AppError('Sorry, Cannot delete chat', 404))
  }
  const messages =  await Message.deleteMany({chat: req.body.chatId})
  if(!messages){
    return next(new AppError("No Messages deleted",404))
  }
  res.status(200).json({
    status:"status",
    message:"Deleted done"
  })
})
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError')
const {catchAsync} = require('../utils/catchAsync')

exports.accesOrCreateChat = catchAsync(async(req, res, next)=>{

    const person = await User.findById(req.body.id)
    
    if(!person){
      return next(new AppError('No user found with that id',404))
    }
    
    var isChat = await Chat.find({ $or: [{ to: person.id }, {from: person.id }]})

    if(isChat.length > 0){
      
      const idString = isChat[0]._id.toString(); 

      const messages = await Message.find({ chat: idString })

      if(!messages){
        return next(new AppError('Sorry, Cannot find messages belongs to yhis chat ', 404))
      }

      res.status(200).json({
          status: true,
          message:"Access successfully",
          chatID: idString,
          data: messages
      }); 

    }else{
      
      const now = new Date();
      const sendingDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const sendingtime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      
      var chat = {
          to:person.id,
          from:req.user.id,
          time:sendingtime,
          data:sendingDate
        }

      const newChat = await Chat.create(chat);  
      
      if(!newChat){
        return next(new AppError('Sorry, Cannot create chat ', 404))
      }

      res.status(200).json({
          status: true,
          message:"chat creatad successfully",
          chatID:newChat.id,
          data: [], 
      }); 
    }
})

exports.allChats = catchAsync(async(req, res, next)=>{
  
    var chats = await Chat.find({ $and: [{ latestMessage: { $ne: null}},{ $or: [{ to: req.user.id }, {from: req.user.id }]}]})
                          .sort({ time: -1 })
                          .sort({ date: -1 }) 
                          .select("-date -time")
                          .populate({
                            path:'to',
                            select:'name photo'
                          })
                          .populate({
                            path:'from',
                            select:'name photo'
                          })
                          .populate({
                            path:'latestMessage',
                            select:'text date time'
                          })

    if(!chats){
      return next(new AppError("Not Found Chats",404))
    }                      

    // for (const obj of chats) {
    //   console.log("in loooooog")
    //   idto = obj.to.toString()
    //   if(idto === req.user.id){
    //     console.log("in iffff")
    //       obj = obj.populate({
    //         path:'from',
    //         select:'name photo'
    //       })
    //   }else{
    //     console.log("in elseeeeeee")
    //     obj = obj.populate({
    //       path:'to',
    //       select:'name photo'
    //     })
    //   }
    // console.log(obj)  
    // }

    res.status(200).json({
        status: true,
        message:"All chat sent successfully",
        loginId:req.user.id,
        data: chats
    }); 
})

exports.deleteAllChats = catchAsync(async(req, res, next)=>{

  const chats = await Chat.deleteMany({ $or: [{ to: req.user.id }, {from: req.user.id }]})
  
  if(!chats){
    return next(new AppError('Sorry, Cannot delete chats',404))
  }

  res.status(200).json({
    status:true,
    message:"deleted successfully",
    
  })
})

exports.deleteChat = catchAsync(async(req, res, next)=>{
 
  const chat = await Chat.findByIdAndDelete(req.body.chatId)
  await Message.deleteMany({chat: req.body.chatId})

  if(!chat){
    return next(new AppError('Sorry, No chat exist with this id ', 404))
  }

  res.status(200).json({
    status:true,
    message:"deleted successfully",
  })

})

exports.filterChat = catchAsync(async(req, res, next) =>{

  const Chats = await Chat.find({ $or: [{ to: req.user._id }, {from: req.user._id }]})
                        .sort({ time: -1 })
                        .sort({ date: -1 }) 
                        .select("-date -time")
                        .populate({
                          path:'to',
                          select:'name photo job'
                        })
                        .populate({
                          path:'from',
                          select:'name photo job'
                        })
                        .populate({
                          path:'latestMessage',
                          select:'text date time'
                        })

  if(!Chats){
    return next(new AppError("Not Found Chats",404))
  }

  const filterChats = Chats.filter((chat) => (chat.to.job === req.body.job || chat.from.job === req.body.job));

  if (!filterChats) {
    return next(new AppError("there's no posts to Get ", 404));
  }

  res.status(200).json({
    status: true,
    message:'filter done',
    data: filterChats,
  });

})
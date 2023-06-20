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

      var deleteFrom = ""
      var deleteTo = ""
      if(isChat[0].deleteFrom !== null){
        deleteFrom = isChat[0].deleteFrom.toString()
      }else if(isChat[0].deleteTo !== null){
        deleteTo = isChat[0].deleteTo.toString()
      }
    
      if(deleteFrom === req.user.id || deleteTo === req.user.id){

        if (req.headers.lang === 'AR') {
          res.status(200).json({
            status: true,
            message:" تم الوصول للمحادثة بنجاح",
            chatID: idString,
            data: []
          });
        } else {
          res.status(200).json({
            status: true,
            message:"Access successfully",
            chatID: idString,
            data: []
          })
        } 

      }else{
        
        if(isChat[0].from.toString() === req.user.id && isChat[0].rechatDateFrom !== null){

          const messages = await Message.find({$and: [{ chat: isChat[0]._id},
            { date:{$gte:isChat[0].rechatDateFrom}},{ time:{$gte:isChat[0].rechatTimeFrom}},]})
                                        .select("-chat")
                                        .sort({ time: 1 })
                                        .sort({ date: 1 }) 
          
          if(!messages){
              return next(new AppError(`Sorry, can't found messages belongs to this chat `, 400))
          }                
          
          if (req.headers.lang === 'AR') {
            res.status(200).json({
              status: true,
              message:"تم ارسال جميع الرسائل بنجاح",
              chatID: idString,
              data: messages
            })
          } else {
            res.status(200).json({
              status: true,
              message:"All Messages sent successfully",
              chatID: idString,
              data: messages
            })
          } 
    
        }else if(isChat[0].from.toString() === req.user.id && isChat[0].rechatDateTo !== null){
          
          const messages = await Message.find({chat: isChat[0]._id})
                                      .select("-chat")
                                      .sort({ time: 1 })   
                                      .sort({ date: 1 }) 
                                                             
          if(!messages){
              return next(new AppError(`Sorry, can't found messages belongs to this chat `, 400))
          }               
          
          if (req.headers.lang === 'AR') {
            res.status(200).json({
              status: true,
              message:"تم ارسال جميع الرسائل بنجاح",
              chatID: idString,
              data: messages
            })
          } else {
            res.status(200).json({
              status: true,
              message:"All Messages sent successfully",
              chatID: idString,
              data: messages
            })
          } 

        }else if(isChat[0].to.toString() === req.user.id && isChat[0].rechatDateTo !== null){
         
          const messages = await Message.find({$and: [{ chat: isChat[0]._id},
            { date:{$gte:isChat[0].rechatDateTo}},{ time:{$gte:isChat[0].rechatTimeTo}},]})
                                        .select("-chat")
                                        .sort({ time: 1 })
                                        .sort({ date: 1 })                              
          if(!messages){
          return next(new AppError(`Sorry, can't found messages belongs to this chat `, 400))
          }      
          
          if (req.headers.lang === 'AR') {
            res.status(200).json({
              status: true,
              message:"تم ارسال جميع الرسائل بنجاح",
              chatID: idString,
              data: messages
            })
          } else {
            res.status(200).json({
              status: true,
              message:"All Messages sent successfully",
              chatID: idString,
              data: messages
            })
          } 

        }else if(isChat[0].to.toString() === req.user.id && isChat[0].rechatDateFrom !== null){
          
          const messages = await Message.find({chat: isChat[0]._id})
                                      .select("-chat")
                                      .sort({ date: 1 }) 
                                      .sort({ time: 1 })                              
          if(!messages){
              return next(new AppError(`Sorry, can't found messages belongs to this chat `, 400))
          }                
    
          if (req.headers.lang === 'AR') {
            res.status(200).json({
              status: true,
              message:"تم ارسال جميع الرسائل بنجاح",
              chatID: idString,
              data: messages
            })
          } else {
            res.status(200).json({
              status: true,
              message:"All Messages sent successfully",
              chatID: idString,
              data: messages
            })
          } 
    
        }else{

          const messages = await Message.find({chat: isChat[0]._id})
                                      .select("-chat")
                                      .sort({ time: 1 })   
                                      .sort({ date: 1 }) 
                                                             
          if(!messages){
              return next(new AppError(`Sorry, can't found messages belongs to this chat `, 400))
          }                
    
          if (req.headers.lang === 'AR') {
            res.status(200).json({
              status: true,
              message:"تم ارسال جميع الرسائل بنجاح",
              chatID: idString,
              data: messages
            })
          } else {
            res.status(200).json({
              status: true,
              message:"All Messages sent successfully",
              chatID: idString,
              data: messages
            })
          } 
        }
      }
       
    }else{
      
      const now = new Date();
      const sendingDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const sendingtime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
      
      var isChat = {
          to:person.id,
          from:req.user.id,
          time:sendingtime,
          date:sendingDate
        }

      const newChat = await Chat.create(isChat);  
      
      if(!newChat){
        return next(new AppError('Sorry, Cannot create chat ', 404))
      }

      if (req.headers.lang === 'AR') {
        res.status(200).json({
          status: true,
          message:"تم انشاء المحادثة بنجاح",
          chatID:newChat.id,
          data: [], 
        });
      } else {
        res.status(200).json({
          status: true,
          message:"chat creatad successfully",
          chatID:newChat.id,
          data: [], 
        });
      } 
    }
})

exports.allChats = catchAsync(async(req, res, next)=>{
  
  var chats = await Chat.find({$and: [{ latestMessage: { $ne: null}},
                                      {$or: [{ to: req.user.id }, {from: req.user.id }]},
                                      {$and:[{deleteFrom: { $ne: req.user.id}},{deleteTo: { $ne: req.user.id}}]}]})
                        .sort({ date: -1 }) 
                        .sort({ time: -1 })
                        .select("-deleteFrom -deleteTo -rechatDateFrom -rechatTimeFrom -rechatTimeTo -rechatDateTo -date -time ")
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

  if (req.headers.lang === 'AR') {
    res.status(200).json({
      status: true,
      message:"تم ارسال جميع المحادثات بنجاح",
      loginId:req.user.id,
      data: chats
    }); 
  } else {
    res.status(200).json({
      status: true,
      message:"All chat sent successfully",
      loginId:req.user.id,
      data: chats
    }); 
  }
})

exports.deleteChat = catchAsync(async(req, res, next)=>{

  const chat = await Chat.findById(req.body.chatId)

  if(!chat){
    return next(new AppError('Sorry, No chat exist with this id ', 404))
  }

  const idFrom = chat.from.toString();
  if(req.user.id === idFrom){
    await Chat.findByIdAndUpdate(chat._id, {deleteFrom : req.user.id}, {
      runValidators: true,
      new: true,
    });
  }else{
    await Chat.findByIdAndUpdate(chat._id, {deleteTo : req.user.id}, {
      runValidators: true,
      new: true,
    });
  }
  
  if(chat.deleteFrom !== null && chat.deleteTo !== null){
    const chat = await Chat.findByIdAndDelete(req.body.chatId)
    await Message.deleteMany({chat: req.body.chatId})
    if(!chat){
      return next(new AppError('Sorry, Cannot delete chat', 404))
    }
  }

  if (req.headers.lang === 'AR') {
    res.status(200).json({
      status:true,
      message:"تم حذف المحادثة بنجاح",
    })
  } else {
    res.status(200).json({
      status:true,
      message:"deleted successfully",
    })
  }

})

exports.deleteAllChats = catchAsync(async(req, res, next)=>{

  const chats = await Chat.find({ $or: [{ to: req.user.id }, {from: req.user.id }]})

  if(!chats){
    return next(new AppError('Sorry, No chat exist with this id ', 404))
  }
  
  for (let i = 0; i < chats.length; i++) {

    const idFrom = chats[i].from.toString();
    if(req.user.id === idFrom){
      await Chat.findByIdAndUpdate(chats[i]._id, {deleteFrom : req.user.id}, {
        runValidators: true,
        new: true,
      });
    }else{
      await Chat.findByIdAndUpdate(chats[i]._id, {deleteTo : req.user.id}, {
        runValidators: true,
        new: true,
      });
    }
  }

  if (req.headers.lang === 'AR') {
    res.status(200).json({
      status:true,
      message:"تم حذف جميع المحادثات بنجاح",
    })
  } else {
    res.status(200).json({
      status:true,
      message:"deleted successfully",
    })
  }
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

  if (req.headers.lang === 'AR') {
    res.status(200).json({
      status: true,
      message:'تم الفلترة بنجاح',
      data: filterChats,
    });
  } else {
    res.status(200).json({
      status: true,
      message:'filter done',
      data: filterChats,
    });
  }
})
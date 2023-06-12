const mongoose = require("mongoose");

const message = mongoose.Schema(
  {
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    text: { 
        type: String, 
        trim: true 
    },
    image:{
      type:String, 
    },
    chat: { type: mongoose.Schema.Types.ObjectId,
        ref: "Chat" 
    },
    readBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    deleteMsg:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    time:String,
    date:String
  },
);

const Message = mongoose.model("Message", message);

module.exports = Message;

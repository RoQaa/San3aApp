const mongoose = require("mongoose");

const chat = mongoose.Schema(
  {
    to: { // store user id for senders & recievers
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    from: { // store user id for senders & recievers
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    latestMessage: { // store message's id
      default: null,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    deleteFrom:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deleteTo:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rechatTimeFrom:{
      type : String,
      default: null
    },
    rechatDateFrom:{
      type : String,
      default: null
    },
    rechatTimeTo:{
      type : String,
      default: null
    },
    rechatDateTo:{
      type : String,
      default: null
    },
    time:String,
    date:String,
  },
);

const Chat = mongoose.model('Chat', chat);

module.exports = Chat;
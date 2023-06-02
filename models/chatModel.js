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
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chat);

module.exports = Chat;
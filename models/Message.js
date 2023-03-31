const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    recipientId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    type:{
        type:String
    },
    message:{
        type:String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", MessageSchema);

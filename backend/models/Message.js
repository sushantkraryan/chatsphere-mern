const mongoose = require("mongoose");

// Every chat message is persisted here — this is what makes chat history
// survive a page refresh, unlike a naive socket-only implementation
// that would lose everything once the browser tab closes.
const messageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// This index speeds up the most common query: "give me the last N
// messages for this room, in time order." Without it, Mongo would
// have to scan every message in the collection as it grows.
messageSchema.index({ room: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);

const mongoose = require("mongoose");

// A Room is just a named chat channel — like a Slack channel.
// Any logged-in user can join any room and see its message history.
const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);

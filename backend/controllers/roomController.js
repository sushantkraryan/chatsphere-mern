const Room = require("../models/Room");
const Message = require("../models/Message");

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: 1 });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Room name is required" });
    }
    const existing = await Room.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Room already exists" });
    }
    const room = await Room.create({ name, createdBy: req.userId });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .populate("sender", "name")
      .sort({ createdAt: 1 })
      .limit(100);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getRooms, createRoom, getMessages };
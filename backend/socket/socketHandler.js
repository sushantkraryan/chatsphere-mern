const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");

function initSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error: no token"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`Socket connected: user ${socket.userId}`);

    await User.findByIdAndUpdate(socket.userId, { isOnline: true });
    io.emit("user_status_changed", { userId: socket.userId, isOnline: true });

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.userId} joined room ${roomId}`);
    });

    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
    });

    socket.on("send_message", async ({ roomId, text }) => {
      try {
        const message = await Message.create({
          room: roomId,
          sender: socket.userId,
          text,
        });
        const populated = await message.populate("sender", "name");
        io.to(roomId).emit("receive_message", populated);
      } catch (err) {
        console.error("Failed to save message:", err.message);
        socket.emit("error_message", { message: "Failed to send message" });
      }
    });

    socket.on("typing", ({ roomId, name }) => {
      socket.to(roomId).emit("user_typing", { name });
    });

    socket.on("stop_typing", ({ roomId }) => {
      socket.to(roomId).emit("user_stopped_typing");
    });

    socket.on("disconnect", async () => {
      console.log(`Socket disconnected: user ${socket.userId}`);
      await User.findByIdAndUpdate(socket.userId, { isOnline: false });
      io.emit("user_status_changed", { userId: socket.userId, isOnline: false });
    });
  });
}

module.exports = initSocket;
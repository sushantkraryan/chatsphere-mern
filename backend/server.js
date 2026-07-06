require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const initSocket = require("./socket/socketHandler");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

app.get("/", (req, res) => {
  res.send("ChatSphere API is running");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
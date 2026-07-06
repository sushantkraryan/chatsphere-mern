import { io } from "socket.io-client";

// We don't connect immediately on import — instead we export a function
// that creates a fresh connection using whatever token is currently
// stored. This matters because the token doesn't exist yet at app
// startup if the user hasn't logged in.
export function createSocket() {
  const token = localStorage.getItem("token");

  // "auth" here is sent once during the initial WebSocket handshake —
  // this is what our backend's io.use() middleware reads and verifies.
  return io("https://chatsphere-mern.onrender.com/api", {
    auth: { token },
  });
}

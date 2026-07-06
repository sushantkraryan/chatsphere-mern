import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { createSocket } from "../socket";
import { useAuth } from "../context/AuthContext";
import RoomList from "../components/RoomList";
import OnlineUsers from "../components/OnlineUsers";

export default function Chat() {
  const { user, logout } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const socket = createSocket();
    socketRef.current = socket;

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user_status_changed", ({ userId, isOnline }) => {
      setOnlineUserIds((prev) =>
        isOnline
          ? [...new Set([...prev, userId])]
          : prev.filter((id) => id !== userId)
      );
    });

    socket.on("user_typing", ({ name }) => setTypingUser(name));
    socket.on("user_stopped_typing", () => setTypingUser(null));

    fetchRooms();

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchRooms = async () => {
    const { data } = await api.get("/rooms");
    setRooms(data);
    if (data.length > 0) handleSelectRoom(data[0]);
  };

  const handleCreateRoom = async (name) => {
    const { data } = await api.post("/rooms", { name });
    setRooms((prev) => [...prev, data]);
    handleSelectRoom(data);
  };

  const handleSelectRoom = async (room) => {
    if (activeRoom) socketRef.current.emit("leave_room", activeRoom._id);

    setActiveRoom(room);
    socketRef.current.emit("join_room", room._id);

    const { data } = await api.get(`/rooms/${room._id}/messages`);
    setMessages(data);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !activeRoom) return;

    socketRef.current.emit("send_message", {
      roomId: activeRoom._id,
      text: text.trim(),
    });
    setText("");
    socketRef.current.emit("stop_typing", { roomId: activeRoom._id });
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (!activeRoom) return;

    socketRef.current.emit("typing", { roomId: activeRoom._id, name: user.name });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stop_typing", { roomId: activeRoom._id });
    }, 1500);
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="chat-page">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-stack">
            <div className="brand-mark">C</div>
            <div>
              <h2>ChatSphere</h2>
              <p>Live rooms & instant replies</p>
            </div>
          </div>
          <button className="ghost-button" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="user-chip">
          <span>{initials}</span>
          <div>
            <strong>{user?.name}</strong>
            <p>Online now</p>
          </div>
        </div>

        <RoomList
          rooms={rooms}
          activeRoom={activeRoom}
          onSelectRoom={handleSelectRoom}
          onCreateRoom={handleCreateRoom}
        />
        <OnlineUsers onlineUserIds={onlineUserIds} currentUserId={user?.id} />
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <div>
            <p className="eyebrow">Live room</p>
            <h3>{activeRoom ? `# ${activeRoom.name}` : "Choose a room"}</h3>
            <p className="chat-room-meta">
              {activeRoom
                ? "Messages sync instantly across your community"
                : "Select a room to start chatting"}
            </p>
          </div>
          <div className="room-pill">{activeRoom ? `${messages.length} messages` : "Open"}</div>
        </header>

        <div className="message-list">
          {!activeRoom ? (
            <div className="empty-state">
              <h4>Welcome to your workspace</h4>
              <p>Select a room from the sidebar to jump into a thoughtful conversation.</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <h4>No messages yet</h4>
              <p>Start the conversation in this room and it will appear here instantly.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`message-row ${msg.sender._id === user?.id ? "own" : ""}`}
              >
                <div className="message-meta">
                  <span>{msg.sender.name}</span>
                </div>
                <div className="message-bubble">
                  <p>{msg.text}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {typingUser && <p className="typing-pill">{typingUser} is typing…</p>}

        <form onSubmit={handleSend} className="message-input">
          <input
            value={text}
            onChange={handleTyping}
            placeholder={activeRoom ? "Message this room..." : "Select a room first"}
            disabled={!activeRoom}
          />
          <button type="submit" disabled={!activeRoom}>
            Send
          </button>
        </form>
      </main>
    </div>
  );
}

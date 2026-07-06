import { useState } from "react";

export default function RoomList({ rooms, activeRoom, onSelectRoom, onCreateRoom }) {
  const [newRoomName, setNewRoomName] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    onCreateRoom(newRoomName.trim());
    setNewRoomName("");
  };

  return (
    <div className="room-list">
      <div className="room-list-header">
        <h3>Rooms</h3>
        <span className="room-count">{rooms.length} available</span>
      </div>
      <ul>
        {rooms.map((room) => (
          <li
            key={room._id}
            className={`room-item ${activeRoom?._id === room._id ? "active" : ""}`}
            onClick={() => onSelectRoom(room)}
          >
            # {room.name}
          </li>
        ))}
      </ul>

      <form onSubmit={handleCreate} className="new-room-form">
        <input
          placeholder="Create a room"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button type="submit" aria-label="Create room">
          +
        </button>
      </form>
    </div>
  );
}

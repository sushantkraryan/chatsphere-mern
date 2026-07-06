export default function OnlineUsers({ onlineUserIds }) {
  return (
    <div className="online-users">
      <div className="room-list-header">
        <h4>Online now</h4>
        <span className="room-count">{onlineUserIds.length} active</span>
      </div>
      <div className="status-badge">
        <span className="status-dot" />
        <span>
          {onlineUserIds.length > 0
            ? `${onlineUserIds.length} people are online`
            : "No one else is online yet"}
        </span>
      </div>
    </div>
  );
}

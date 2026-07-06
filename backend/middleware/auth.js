const jwt = require("jsonwebtoken");

// Used to protect regular HTTP routes (e.g. fetching room list).
// Note: Socket.io connections need their OWN separate auth check,
// since a WebSocket handshake isn't a normal HTTP request-response —
// see socket/socketHandler.js for that version.
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = protect;

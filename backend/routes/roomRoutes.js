const express = require("express");
const { getRooms, createRoom, getMessages } = require("../controllers/roomController");
const protect = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", getRooms);
router.post("/", createRoom);
router.get("/:roomId/messages", getMessages);

module.exports = router;

# ChatSphere 💬

A real-time chat application built with the MERN stack and Socket.io. Users can sign up, join multiple chat rooms, and exchange messages instantly — with live online status and typing indicators.

## Features

- **Real-time messaging** — messages appear instantly for everyone in a room, no refresh needed
- **Multiple chat rooms** — create and join topic-based rooms
- **JWT authentication** — secure signup/login with bcrypt password hashing
- **Persistent chat history** — messages are stored in MongoDB, so history survives refreshes and server restarts
- **Live online/offline status** — see who's currently active
- **Typing indicators** — see when someone else is typing, in real time
- **Protected routes** — both API endpoints and frontend pages require authentication

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios, Socket.io-client |
| Backend | Node.js, Express, Socket.io |
| Database | MongoDB with Mongoose |
| Auth | JWT, bcryptjs |

## Architecture Overview

ChatSphere uses two complementary communication patterns:

- **REST API** (`/api/auth`, `/api/rooms`) handles request/response actions — login, signup, fetching the room list, and loading chat history.
- **WebSockets (Socket.io)** handle real-time, event-driven communication — sending messages, typing indicators, and online status — where the server needs to push updates to clients instantly without being asked.

WebSocket connections are authenticated separately from HTTP routes: the client sends its JWT during the initial Socket.io handshake, which is verified by a dedicated `io.use()` middleware before any real-time events are allowed.

## Project Structure

```
chatsphere-mern/
├── backend/
│   ├── models/          # Mongoose schemas: User, Room, Message
│   ├── controllers/     # Route handler logic for auth and rooms
│   ├── middleware/      # JWT verification for HTTP routes
│   ├── socket/          # Socket.io connection and event handling
│   ├── routes/          # Express route definitions
│   ├── config/          # Database connection setup
│   ├── server.js        # App entry point (Express + Socket.io)
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/          # Axios instance with JWT auto-attachment
    │   ├── socket.js     # Socket.io client connection setup
    │   ├── context/      # Global auth state (React Context)
    │   ├── components/   # Reusable UI: RoomList, OnlineUsers, ProtectedRoute
    │   ├── pages/         # Login, Signup, Chat
    │   └── App.jsx
    └── package.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- A [MongoDB Atlas](https://cloud.mongodb.com/) account (free tier works fine) or a local MongoDB instance

### 1. Clone and install

```bash
git clone https://github.com/sushantkraryan/chatsphere-mern.git
cd chatsphere-mern

cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

In the `backend` folder, copy the example env file:

```bash
cp .env.example .env
```

Fill in your values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret_string
```

### 3. Run the app

Start the backend:

```bash
cd backend
node server.js
```

In a separate terminal, start the frontend:

```bash
cd frontend
npm run dev
```

Open the URL shown in your terminal (typically `http://localhost:5173`).

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/signup` | Create a new account | No |
| POST | `/api/auth/login` | Log in and receive a JWT | No |
| GET | `/api/rooms` | List all chat rooms | Yes |
| POST | `/api/rooms` | Create a new room | Yes |
| GET | `/api/rooms/:roomId/messages` | Fetch message history for a room | Yes |

## Socket.io Events

| Event | Direction | Description |
|---|---|---|
| `join_room` | Client → Server | Join a specific room's broadcast channel |
| `leave_room` | Client → Server | Leave a room's broadcast channel |
| `send_message` | Client → Server | Send a new message to a room |
| `receive_message` | Server → Client | Broadcast a new message to everyone in the room |
| `typing` | Client → Server | Notify the room that the user is typing |
| `stop_typing` | Client → Server | Notify the room that the user stopped typing |
| `user_typing` | Server → Client | Relay typing status to other users |
| `user_status_changed` | Server → Client | Broadcast a user's online/offline status change |

## Future Improvements

- Pagination / infinite scroll for long message histories
- Private one-on-one direct messages, in addition to rooms
- Read receipts
- Reconnection handling for dropped socket connections
- Input validation with a schema library (e.g. Zod or Joi)

## License

This project is open source and available under the [MIT License](LICENSE).

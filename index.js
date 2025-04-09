// server.js - Express Socket.IO server
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_API, // Replace with your Next.js app URL
    methods: ["GET", "POST"],
  },
});

// Enable CORS for Express
app.use(cors());

// Basic route
app.get("/", (req, res) => {
  res.send("Express Socket.IO Server is running");
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  // Join a room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  // Send message to a room
  socket.on("send_message", ({ roomId, message, user }) => {
    const data = { message, user };
    socket.to(roomId).emit("receive_message", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT);

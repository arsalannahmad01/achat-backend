require("dotenv").config();
require("express-async-errors");
const express = require("express");
const crypto = require('crypto')
const app = express();
const http = require("http");
const cors = require("cors");
const socket = require("socket.io");
const connectDB = require("./db/connect");
const UserRouter = require("./routes/User");
const AuthUserRouter = require("./routes/AuthUser");
const MessageRouter = require('./routes/Message')

const authMiddleware = require("./middleware/authentication");

app.use(express.json());
app.use(cors());

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/authuser", authMiddleware, AuthUserRouter);
app.use("/api/v1/message", authMiddleware, MessageRouter);

// const server = http.createServer(app);
const port = process.env.PORT || 8088;

const server = http.createServer(app);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    Credential: true,
  },
});

// global.onlineUsers = {};
io.on("connection", async (socket) => {
  let roomId = null
  await socket.on("joinRoom", async (ids) => {
    const sortedIds = ids.sort();
    const concatenatedIds = sortedIds.join("");
    const hash = crypto
      .createHash("sha256")
      .update(concatenatedIds)
      .digest("hex");
    roomId = hash.substring(0, 16)
    socket.join(`${hash.substring(0, 16)}`);
    console.log(`User ${socket.id} joined room ${hash.substring(0, 16)}`);
  });

  socket.on("send-msg", (data) => {
    socket.to(roomId).emit("msg-recieve", data);
  });

  socket.on("disconnect", () => {
    console.log('Disconnected:', socket.id);
  })
});

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    console.log("Database connection established...");
    server.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(`Error connecting to db: ${error}`);
  }
};

start();

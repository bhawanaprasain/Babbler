const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const PORT = process.env.PORT || 5000;

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const router = require("./router");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);

io.on("connection", socket => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room`
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", test: `${user.name} has joined` });
    socket.join(user.room);
  });

  socket.on("disconnect", () => {
    console.log("user has left");
  });
});

server.listen(PORT, console.log(`server running on port ${PORT}`));

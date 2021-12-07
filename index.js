const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const express = require("express");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 4000;
let users = [];
app.use(cors());
app.get("/", (req, res) => {
  res.send("server running");
});
io.on("connection", (socket) => {
  console.log("new connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined `);
    socket.broadcast.emit("userjoined", {
      user: "Admin",
      message: ` ${users[socket.id]} has joined`,
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat, ${users[socket.id]} `,
    });
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sendedMsg", { user: users[id], message, id });
  });
  socket.on("disconnect", () => {
    io.emit("userleft", {
      user: "Admin",
      message: `${users[socket.id]} left the Dev chat`,
    });
  });
});

server.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});

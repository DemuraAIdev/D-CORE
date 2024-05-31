const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

httpServer.listen(7053);
console.log("Server started");

io.on("connection", (socket) => {
  console.log(socket.id); // the id of the socket
  socket.on("hello", (arg) => {
    console.log(arg);
    socket.emit("hello", "Welcome to DCORE, " + socket.id);
  });
});

io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});

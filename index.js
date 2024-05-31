const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("./lib/console");
const app = express();
const httpServer = createServer(app);
const config = require("./config/config");
const Keyv = require("keyv");
const io = new Server(httpServer, {
  /* options */
});

const db = new Keyv(config.database, { namespace: "warn" }).on("error", (err) =>
  console.error("Keyv connection error:", err)
);
httpServer.listen(config.port);
console.info("Server started at port " + config.port + ".");

io.on("connection", (socket) => {
  console.info("A Clinet connected: " + socket.id);
  socket.on("notice", (arg) => {
    console.info(socket.id + " said: " + arg);
    socket.emit("notice", "Welcome to DCORE, " + socket.id);
  });

  socket.on("disconnect", () => {
    console.warn("A Clinet disconnected: " + socket.id);
  });

  // socket on ping
  socket.on("ping", (cb) => {
    console.info("pinged from" + socket.id);
    cb({
      status: "ok",
    });
  });

  socket.on("db", async (query, callback) => {
    console.info("db event from: " + socket.id);
    const value = await db.get(query.key);
    console.info("value: " + value);
    callback({
      status: "ok",
      value: value,
    });
  });

  socket.on("ready", (arg) => {
    console.info("=====================================");
    console.info("Ready Event from: " + socket.id);
    console.info("Total Members: " + arg.totalMembers);
    console.info("Prototype: " + arg.prototype);
    console.info("=====================================");
  });
});

//

io.engine.on("connection_error", (err) => {
  console.error(err.req); // the request object
  console.error(err.code); // the error code, for example 1
  console.error(err.message); // the error message, for example "Session ID unknown"
  console.error(err.context); // some additional error context
});

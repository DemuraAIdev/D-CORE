const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("./lib/console");
const app = express();
const httpServer = createServer(app);
const config = require("./config/config");
const Keyv = require("keyv");
const { resolve } = require("path");
const fs = require("fs");
const { error } = require("console");
const io = new Server(httpServer, {
  /* options */
});
let errorCount = 0;

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

  // status websocket
  socket.on("status", (callback) => {
    console.info(socket.id + " Request status");

    // Get the count of connected sockets
    let connectedClients = io.engine.clientsCount;

    callback({
      status: errorCount === 0 ? "OK" : errorCount < 5 ? "WARN" : "ERROR",
      message: "DCORE is running",
      connectedClients: connectedClients, // Include the count in the emitted status
      errorCount: errorCount,
    });
  });
  // add socket module loaders here
  const files = fs
    .readdirSync(resolve(__dirname, "module"))
    .filter((file) => file.endsWith(".js"));

  for (const file of files) {
    try {
      console.info("Loading module: " + file);
      const module = require(resolve(__dirname, "module", file));
      if (module === undefined) {
        console.warn(
          `File ${file} is not a valid module file Unload module...`
        );
        continue; // Ignore the module and continue to the next one
      }
      if (module.enabled === false) {
        console.warn(`Module ${module.conf.name} is disabled. Skipping...`);
        continue; // Ignore the module and continue to the next one
      }

      if (module.once) {
        socket.once(module.name, (...args) => module.execute(socket, ...args));
      } else {
        socket.on(module.name, (...args) => module.execute(socket, ...args));
      }
    } catch (error) {
      errorCount++;
      console.error("Error Loading Module Skipping it " + file);
      console.error(error);
      continue; // Ignore the module and continue to the next one
    }
  }
});

io.of("/db").on("connection", (socket) => {
  socket.db = db;
  console.info("A DB Client connected: " + socket.id);
  socket.on("notice", (arg) => {
    console.info(socket.id + " said: " + arg);
    socket.emit("notice", "Welcome to DCORE DB, " + socket.id);
  });

  socket.on("disconnect", () => {
    console.warn("A DB Client disconnected: " + socket.id);
  });

  socket.on("get", async (query, callback) => {
    const value = await db.get(query.key);
    console.info("value: " + JSON.stringify(value));
    callback(value);
  });

  socket.on("set", async (query) => {
    const value = await db.set(query.key, query.value);
    console.info("value: " + JSON.stringify(value));
  });

  socket.on("delete", async (query) => {
    const value = await db.delete(query.key);
    console.info("value: " + JSON.stringify(value));
  });

  socket.on("update", async (query, callback) => {
    const value = await db.update(query.key, query.value);
    console.info("value: " + JSON.stringify(value));
    callback(value);
  });

  socket.on("has", async (query, callback) => {
    const value = await db.has(query.key);
    console.info("value: " + JSON.stringify(value));
    callback(value);
  });
});

//

io.engine.on("connection_error", (err) => {
  errorCount++;
  console.error(err.req); // the request object
  console.error(err.code); // the error code, for example 1
  console.error(err.message); // the error message, for example "Session ID unknown"
  console.error(err.context); // some additional error context
});

// unhandled error
process.on("unhandledRejection", (error) => {
  errorCount++;
  console.error("Uncaught Promise Rejection: ", error);
});

// uncaught error
process.on("uncaughtException", (error) => {
  errorCount++;
  console.error("Uncaught Exception: ", error);
});

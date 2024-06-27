module.exports = {
  name: "stats",
  once: false,
  enabled: true,
  async execute(socket, arg) {
    const db = socket.db2;

    console.info(socket.id + " received stats");
    arg.proto = await db.get("proto");
    socket.broadcast.emit("stats", arg);
  },
};

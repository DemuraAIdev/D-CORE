module.exports = {
  name: "stats",
  once: false,
  enabled: true,
  async execute(socket, arg) {
    const db = socket.db2;

    console.info(socket.id + " received stats");
    arg.proto = await db.get("proto");
    socket.broadcast.emit("stats", arg);
    // db.set("totalMembers", arg.totalMembers);
    // db.set("activeMembers", arg.activeMembers);
    // db.set("offlineMembers", arg.offlineMembers);
    // db.set("users", arg.users);

    // broadcast to all clients
  },
};

module.exports = {
  name: "ready",
  once: false,
  enabled: true,
  execute(socket, arg, callback, tempDB) {
    const db = socket.db2;
    console.info("=====================================");
    console.info("Ready Event from: " + socket.id);
    console.info("Prototype: " + arg.prototype);
    console.info("=====================================");

    db.set("proto", arg.prototype);
  },
};

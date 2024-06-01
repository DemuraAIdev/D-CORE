module.exports = {
  name: "ready",
  once: false,
  enabled: true,
  execute(socket, arg) {
    console.info("=====================================");
    console.info("Ready Event from: " + socket.id);
    console.info("Total Members: " + arg.totalMembers);
    console.info("Prototype: " + arg.prototype);
    console.info("=====================================");
  },
};

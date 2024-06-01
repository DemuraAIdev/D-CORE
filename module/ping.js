module.exports = {
  name: "ping",
  once: false,
  enabled: true,
  execute(socket, cb) {
    console.info("pinged from" + socket.id);
    cb({
      status: "ok",
    });
  },
};

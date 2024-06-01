module.exports = {
  name: "db",
  once: false,
  enabled: true,
  async execute(socket, query, callback) {
    const db = socket.db;
    console.info("db event from: " + socket.id);
    const value = await db.get(query.key);
    console.info("value: " + JSON.stringify(value));
    callback({
      status: "ok",
      value: value,
    });
  },
};

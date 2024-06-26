module.exports = {
  name: "stats",
  once: false,
  enabled: true,
  async execute(socket, arg, callback, tempDB) {
    const db = socket.db2;
    console.log(arg);

    if (arg.type === "send") {
      console.info(socket.proto + " Stats : " + arg.totalMembers);
      if (arg.totalMembers === undefined) {
        callback({
          status: "error",
          message: "totalMembers is required",
        });
        return;
      }
      db.set("totalMembers", arg.totalMembers);
      db.set("activeMembers", arg.activeMembers);
      db.set("offlineMembers", arg.offlineMembers);
      db.set("users", arg.users);
    } else {
      console.log("stats requested by " + socket.id);
      const totalM = await db.get("totalMembers");
      const activeM = await db.get("activeMembers");
      const offlineM = await db.get("offlineMembers");
      const proto = await db.get("proto");
      const users = await db.get("users");
      console.log(users);

      callback({
        proto: proto,
        totalMembers: totalM,
        activeMembers: activeM,
        offlineMembers: offlineM,
        users: users,
      });
    }
  },
};

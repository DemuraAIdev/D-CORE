const { SaveMessage } = require("../lib/SaveMessage");
module.exports = {
  name: "chat",
  once: false,
  enabled: true,
  execute(socket, arg) {
    const { message, author, channel } = arg;
    console.info(
      socket.id + " CHAT : " + author.username + " : " + message.content
    );
    message.author = author;
    message.channel = channel;

    SaveMessage(message);

    // broadcast to all clients
    socket.broadcast.emit("chat", message);
  },
};

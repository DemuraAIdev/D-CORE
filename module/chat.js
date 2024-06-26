module.exports = {
  name: "chat",
  once: false,
  enabled: true,
  execute(socket, arg, callback, tempDB) {
    const { message, author, channel } = arg;
    console.info(
      tempDB.get("proto") +
        " CHAT : " +
        author.username +
        " : " +
        message.content
    );
    message.author = author;
    message.channel = channel;

    // broadcast to all clients
    socket.broadcast.emit("chat", {
      id: socket.id,
      content: message,
    });
  },
};

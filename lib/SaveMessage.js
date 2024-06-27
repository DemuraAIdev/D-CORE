const e = require("express");
const { createClient } = require("redis");

const client = createClient({
  password: "RIMxiItZNnspzNZbUO3eAx8T1ANr1edy",
  socket: {
    host: "redis-19882.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com",
    port: 19882,
  },
})
  .on("error", (error) => {
    console.error(error);
  })
  .connect();

async function SaveMessage(message) {
  // Save the message to the database
  const key = `messages:${message.id}`;
  (await client).set(key, JSON.stringify(message));
}

// Get all messages from the database
async function GetMessages() {
  const keys = await (await client).keys("messages:*");
  // Ensure keys is an array before proceeding
  const keysArray = Array.isArray(keys) ? keys : [keys];
  const messages = await Promise.all(
    keysArray.map(async (key) => {
      const message = await (await client).get(key);
      return JSON.parse(message);
    })
  );
  // Sort messages by createdTimestamp in descending order
  messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
  return messages;
}
exports.SaveMessage = SaveMessage;
exports.GetMessages = GetMessages;

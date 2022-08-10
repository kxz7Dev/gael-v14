const client = require("../index");
const { ActivityType } = require("discord.js")

client.on("ready", async () => {
  console.log(`${client.user.username} Iniciado`);
  client.user.setPresence({
    activities: [{ name: `Update Gael | V13 > V14`, type: ActivityType.Listening }],
    status: 'dnd',
  });
});
const BOT = require("./handlers/Client");
const { token } = require("./settings/config");
const client = new BOT();
module.exports = client;
client.build(token);
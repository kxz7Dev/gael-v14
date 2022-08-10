const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const BOT = require("./Client");

/**
 *
 * @param {BOT} client
 */
module.exports = async (client) => {
  const { guildID, embed: ee } = client.config;
  // LOADING SLASH COMMANDS
  try {
    let arrayOfcommands = [];
    fs.readdirSync("./Commands/Slash").forEach((cmd) => {
      let commands = fs
        .readdirSync(`./Commands/Slash/${cmd}/`)
        .filter((file) => file.endsWith(".js"));
      for (cmds of commands) {
        let pull = require(`../Commands/Slash/${cmd}/${cmds}`);
        if (pull.name) {
          client.commands.set(pull.name, pull);
          arrayOfcommands.push(pull);
        } else {
          continue;
        }
      }
    });
    client.on("ready", async () => {
      // // for global slash commands
      // await client.application.commands.set(arrayOfcommands);
      // for guild commands
      client.application.commands.set(arrayOfcommands);
    });
    console.log(`Foram carregados um total de: ${client.commands.size} SlashCommands`);
  } catch (e) {
    console.log(e);
  }

  // LOADING MESSAGE COMMANDS
  try {
    fs.readdirSync("./Commands/Message").forEach((cmd) => {
      let commands = fs
        .readdirSync(`./Commands/Message/${cmd}/`)
        .filter((file) => file.endsWith(".js"));
      for (cmds of commands) {
        let pull = require(`../Commands/Message/${cmd}/${cmds}`);
        if (pull.name) {
          client.mcommands.set(pull.name, pull);
        } else {
          console.log(`${cmds} Command is not Ready`);
          continue;
        }
        if (pull.aliases && Array.isArray(pull.aliases))
          pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
      }
    });
    console.log(`Foram carregados um total de: ${client.mcommands.size} Comandos`);
  } catch (e) {
    console.log(e);
  }
  // Loading Event Files
  try {
    fs.readdirSync("./events/").forEach((file) => {
      const events = fs
        .readdirSync("./events/")
        .filter((file) => file.endsWith(".js"));
      for (let file of events) {
        let pull = require(`../events/${file}`);
        if (pull) {
          client.events.set(file, pull);
        }
      }
    });
    console.log(`Foram carregados um total de: ${client.events.size} Eventos`);
  } catch (e) {
    console.log(e);
  }

  client.embed = (interaction, data) => {
    let user = interaction.user ? interaction.user : interaction.author;
    if (interaction.deferred) {
      interaction
        .followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(ee.color)
              .setDescription(` ** ${data.substring(0, 3000)} **`)
              .setFooter({
                text: user.tag,
                iconURL: user.displayAvatarURL({ dynamic: true }),
              }),
          ],
        })
        .catch((e) => {});
    } else {
      interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor(ee.color)
              .setDescription(` ** ${data.substring(0, 3000)} **`)
              .setFooter({
                text: user.tag,
                iconURL: user.displayAvatarURL({ dynamic: true }),
              }),
          ],
        })
        .catch((e) => {});
    }
  };
};

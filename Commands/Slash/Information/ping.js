const { Message } = require("discord.js");

const BOT = require("../../../handlers/Client");

const { ApplicationCommandOptionType, ContextMenuCommandInteraction, ApplicationCommandType, ButtonStyle, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {

  name: "ping",

  description: `(Information) - Veja o ping do Gael`,

  type: ApplicationCommandType.ChatInput,

  /**

   *

   * @param {BOT} client

   * @param {Message} message

   * @param {String[]} args

   * @param {String} prefix

   */

  run: async (client, interaction, args, prefix) => {

    // Code

    const embed = new EmbedBuilder()

    .setColor("Random")

    .setTimestamp(new Date())

    .addFields({ name: `🏓 | API Latency: ${client.ws.ping}`, value: `ㅤ`, inline: true })

    interaction.followUp({ embeds: [embed] })

  },

};


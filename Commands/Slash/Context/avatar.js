const { ContextMenuCommandInteraction, ButtonStyle, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");
const BOT = require("../../../handlers/Client");
const axios = require('axios');

module.exports = {
  name: "View avatar",
  category: "Context",
  type: ApplicationCommandType.User,
  /**
   *
   * @param {BOT} client
   * @param {ContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    let user =
      interaction.guild.members.cache.get(interaction.targetId) ||
      client.users.cache.get(interaction.targetId);

      axios

      .get(`https://discord.com/api/users/${user.id}`, {

          headers: {

              Authorization: `Bot ${client.token}`,

          },

      })

      .then((res) => {

          const { avatar } = res.data;
 
          if (avatar) {

              const extension = avatar.startsWith("gaelavatar_") ? '.gif?size=4096' : '.png?size=4096';

              const url = `https://cdn.discordapp.com/avatars/${user.id}/${avatar}${extension}`;
      const embed = new EmbedBuilder()

        .setImage(url)

        .setDescription(`:frame_photo: Avatar de ${user}`)

        .setColor('Random')

      const button = new ActionRowBuilder()

        .addComponents(

          new ButtonBuilder()



            .setStyle(ButtonStyle.Link)

            .setLabel('Abrir avatar no navegador')

            .setURL(user.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }))

        )

      interaction.editReply({
        embeds: [embed], components: [button]
      });
    }else {
      const embeddanger = new EmbedBuilder()

                        .setDescription(`<:error:961380985851740180> | ${user} não possui um avatar!`)

                        .setColor('Random')

                    interaction.followUp({ embeds: [embeddanger] })
    }
  })
  }
  }; 

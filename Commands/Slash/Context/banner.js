const { ApplicationCommandOptionType, ContextMenuCommandInteraction, ApplicationCommandType, ButtonStyle, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const BOT = require("../../../handlers/Client");
const axios = require('axios');

module.exports = {
    name: "View banner",
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

                const { banner } = res.data;
       
                if (banner) {

                    const extension = banner.startsWith("a_") ? '.gif?size=4096' : '.png?size=4096';

                    const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}`;

                    const bannerimg = new EmbedBuilder()

                        .setDescription(`:frame_photo: Banner de ${user}`)

                        .setImage(`${url}`)

                        .setColor(interaction.member.displayColor)

                    const button = new ActionRowBuilder()

                        .addComponents(

                            new ButtonBuilder()



                                .setStyle(ButtonStyle.Link)


                                .setLabel('Abrir banner no navegador')

                                .setURL(`${url}`)

                        )

                    interaction.followUp({
                        embeds: [bannerimg], components: [button]
                    });
                }else {

                    const embeddanger = new EmbedBuilder()

                        .setDescription(`<:error:961380985851740180> | ${user} não possui um banner no perfil!`)

                        .setColor('Random')

                    interaction.followUp({ embeds: [embeddanger] })
                }
            })
    }
};
const { ApplicationCommandType, ButtonStyle, EmbedBuilder, ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const moment = require("moment")
const axios = require('axios');

module.exports = {
    name: 'user',
    description: 'kxz',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'avatar',
            description: "(Utility) - Veja o seu avatar ou de algum Usuario.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "Mencione o user que deseja ver o Avatar.",
                    type: ApplicationCommandOptionType.User,
                    required: false,
                }
            ]

        },

        {
            name: 'banner',
            description: "(Utility) - Veja o seu banner ou de algum Usuario.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "Mencione o user que deseja ver o banner.",
                    type: ApplicationCommandOptionType.User,
                    required: false,
                }
            ]

        },
              
    ],

    run: async (client, interaction, args) => {

        const [subcommand] = args;

        if (subcommand === 'avatar') {
            const user = interaction.options.getUser('user') || interaction.user

            const embed = new EmbedBuilder()

                .setImage(user.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }))

                .setTitle(`:frame_photo: Avatar de ${user.username}`)

                .setColor(interaction.member.displayColor)

                .setFooter({ text: `Author: ${interaction.member.user.tag}` })

                .setTimestamp()

            const button = new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()



                        .setStyle(ButtonStyle.Link)

                        .setLabel('Abrir avatar no navegador')

                        .setURL(user.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }))

                )

            interaction.followUp({ embeds: [embed], components: [button] })

        }

        if (subcommand === 'banner') {

            const user = interaction.options.getUser('user') || interaction.user

            if (!user) return interaction.followUp('Mencione um usúario.');





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

                            .setTitle(`:frame_photo: Banner de: ${user.username}`)

                            .setImage(`${url}`)

                            .setColor(interaction.member.displayColor)

                            .setFooter({ text: `Author: ${interaction.member.user.tag}` });





                        const button = new ActionRowBuilder()

                            .addComponents(

                                new ButtonBuilder()



                                    .setStyle(ButtonStyle.Link)


                                    .setLabel('Abrir banner no navegador')

                                    .setURL(`${url}`)

                            )
                        interaction.followUp({ embeds: [bannerimg], components: [button] })

                    } else {

                        const embeddanger = new EmbedBuilder()

                            .setDescription(`<:error:961380985851740180> | ${user} não possui um banner no perfil!`)

                            .setColor('#ff0000')

                        interaction.followUp({ embeds: [embeddanger], ephemeral: true })
                    }
                })
        }
    }
}
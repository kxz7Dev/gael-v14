const ms = require('ms')

const Discord = require('discord.js')

module.exports = {

  name: 'sorteio',

  description: '(Moderation) - Inicia um sorteio no Servidor',

  type: Discord.ApplicationCommandType.ChatInput,

  options: [

    {

      name: "setup",

      description: "(Moderation) - Inicia um sorteio no Servidor",

      type: Discord.ApplicationCommandOptionType.Subcommand,

      options: [

        {

          name: "premio",

          description: "Premio que sera sorteado",

          type: 3,

          required: true

        },

        {

          name: "descricao",

          description: "Descreva uma descricao para o sorteio",

          type: 3,

          required: true

        },

        {

          name: "tempo",

          description: "1s (Segundos) / 1m (Minutos) / 1h (Horas) / 1d (Dias)",

          type: 3,

          required: true

        },

      ],

    },

  ],

  run: async (client, interaction, args) => {

    const [subcommands] = args;

    if (subcommands === 'setup') {

      if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) return interaction.followUp({

        content: `**Você precisa da permissão \`MANAGE_GUILD\` para utilizar este comando**`, ephemeral: true

      })

      const desc = interaction.options.getString("descricao")

      const prem = interaction.options.getString("premio")

      const temp = interaction.options.getString('tempo')

      if (!temp.endsWith("s") && !temp.endsWith("m") && !temp.endsWith("h") && !temp.endsWith("d")) return interaction.followUp('**Utilize o exemplo a seguir: 1s / 1m / 1h /1d**')

      const button = new Discord.ActionRowBuilder()

        .addComponents(

          new Discord.ButtonBuilder()

            .setCustomId('botao')

            .setEmoji('<a:giveaway:1005269514809782343>')

            .setStyle(Discord.ButtonStyle.Primary)

        )

      const button2 = new Discord.ActionRowBuilder()

        .addComponents(

          new Discord.ButtonBuilder()

            .setCustomId('botao2')

            .setEmoji('<a:giveaway:1005269514809782343>')

            .setLabel('Sorteio Finalizado')

            .setDisabled(true)

            .setStyle(Discord.ButtonStyle.Danger)

        )

      let clicaramNoMeuBotao = [];

      const embed = () => new Discord.EmbedBuilder()

      .setTitle('<a:giveaway:1005269514809782343> Novo Sorteio!')

        .setColor('#5865f2')

        .setDescription(`Termina: <t:${~~((Date.now() + ms(temp)) / 1000)}:R> (<t:${~~((Date.now() + ms(temp)) / 1000)}:F>)\nSorteado por: ${interaction.member.user}\nDescrição: **${desc}**\nEntradas: ${clicaramNoMeuBotao.length == 0 ? "0" : `${clicaramNoMeuBotao.length}`}`)

        .setFooter({ text: `Novo Sorteio!` })

        .setTimestamp(Date.now() + ms(temp))

      const msg = await interaction.followUp({

        embeds: [embed()], components: [button]

      })

      const coletor = msg.createMessageComponentCollector({

        time: ms(temp)

      })

      coletor.on("end", (i) => {

        msg.edit({

          components: [button2]

        })

      })

      coletor.on("collect", (i) => {

        if (i.customId === 'botao') {

          const embed4 = new Discord.EmbedBuilder()

            .setDescription(`<:error:961380985851740180> **|** Você ja está no Sorteio.`)

          if (clicaramNoMeuBotao.includes(i.user.id)) return i.reply({

            embeds: [embed4], ephemeral: true

          })

          clicaramNoMeuBotao.push(i.user.id)

          interaction.editReply({

            embeds: [embed()]

          })

          const user = interaction.user

          const embed3 = new Discord.EmbedBuilder()

            .setDescription(`<:concluido:961380895292538960> **|** ${user} Você entrou no sorteio`)

          i.reply({

            embeds: [embed3], ephemeral: true

          })

        }

      })

      setTimeout(() => {

        let ganhador = clicaramNoMeuBotao[Math.floor(Math.random() * clicaramNoMeuBotao.length)]

        {

          const embedterminou = new Discord.EmbedBuilder()

            .setDescription(`**Sorteio cancelado pois ninguem participou!**`)

          if (clicaramNoMeuBotao.length == 0) return msg.edit({ embeds: [embedterminou] })

        }

        const embededit = new Discord.EmbedBuilder()

          .setTitle('<a:giveaway:1005269514809782343> Sorteio Finalizado!')

          .setDescription(`Termina: **Finalizado**\nSorteado por: ${interaction.member.user}\nDescrição: **${desc}**\nEntradas: ${clicaramNoMeuBotao.length == 0 ? "0" : `${clicaramNoMeuBotao.length}`}\nGanhador: <@${ganhador}>`)

          .setFooter({ text: `Sorteio Finalizado! Obrigado a todos que Participaram.` })

          .setColor('#873a3e')

        msg.edit({ embeds: [embededit] })

        interaction.followUp(`<a:giveaway:1005269514809782343> **|** Parabéns <@${ganhador}> por ganhar o sorteio **${prem}**! <a:giveaway:1005269514809782343>`)

        client.users.cache.get(ganhador).send(`<a:giveaway:1005269514809782343> **|** Parabéns <@${ganhador}> por ganhar o sorteio **${prem}** no servidor \`${interaction.guild.name}\`! <a:giveaway:1005269514809782343>`).catch(error => console.log('DM Fechada', error))

      },

        ms(temp))

    }

  }

}

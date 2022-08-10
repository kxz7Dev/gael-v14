const { ApplicationCommandType, ButtonStyle, EmbedBuilder, ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const moment = require("moment")
const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'server',
    description: '(info)',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
          name: 'icon',
          description: "(Utility) - Veja o icone de perfil do Servidor",
          type: ApplicationCommandOptionType.Subcommand,
        },   
        {
          name: 'info',
          description: "(Utility) - Veja informacoes sobre o Servidor",
          type: ApplicationCommandOptionType.Subcommand,
        },   
    ],

    run: async (client, interaction, args) => {
    	
      
        var guildname = interaction.guild.name
        
        const [subcommand] = args;

        if(subcommand === 'icon') { 
        	
          
          const embedicon = new EmbedBuilder()

        .setTitle(`:frame_photo: icone de ${guildname}`)

        .setColor(interaction.member.displayColor)

        .setImage(interaction.guild.iconURL({dynamic: true, size: 1024}))
         
  
          interaction.followUp({ embeds: [embedicon] })
}

       if(subcommand === 'info') { 
       	
         const dono_id = interaction.guild.ownerId
         const dono = interaction.guild.members.cache.get(dono_id)
         const canais = interaction.guild.channels.cache.size
         const chats = interaction.guild.channels.cache.filter(a => a.type === "GuildText").size
         const calls = interaction.guild.channels.cache.filter(a => a.type === "GuildVoice").size
         const data = interaction.guild.createdAt.toLocaleDateString("pt-br")
         
          const embedserver = new EmbedBuilder()
          .setColor("Random")
          .setTitle(`<:Discord:1003133135673905172> ${interaction.guild.name}`)
          .addFields({ name: `:computer: **ID**`, value: `${interaction.guild.id}`})
          .addFields({ name: `:computer: **Cluster ID**`, value: `1 — Gael Cluster 1 (Monly)`})
          .addFields({ name: `:crown: **Dono**`, value: `${dono.user.tag}`})
          .addFields({ name: `:earth_americas: **Região**`, value: `${interaction.guild.preferredLocale}`})
          .addFields({ name: `:speech_balloon: **Canais (${canais})**`, value: `:pencil: **Texto:** ${chats}\n:speaking_head: **Voz:** ${calls}`})
          .addFields({ name: `<:boostermmm:976946385406525572> **Impulsos**`, value: `${interaction.guild.premiumSubscriptionCount || 'Nenhum Booster'}`})
          .addFields({ name: `:calendar: **Criado em**`, value: `${data}`})
          .addFields({ name: `:busts_in_silhouette: **Membros**`, value: `${interaction.guild.memberCount}` })
          
          interaction.followUp({ embeds: [embedserver] })
}
}
}
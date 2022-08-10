const { ApplicationCommandOptionType } = require("discord.js");
const client = require("..");
const { options } = require("../Commands/Slash/Information/user");
const { cooldown } = require("../handlers/functions");
const { emoji } = require("../settings/config");

client.on("interactionCreate", async (interaction) => {
  // Slash Command Handling
  if (interaction.isChatInputCommand()) {
    await interaction.deferReply({ ephemeral: false }).catch((e) => {});
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd)
      return client.embed(
        interaction,
        `${emoji.ERROR} \`${interaction.commandName}\` Comando não encontrado`
      );
    const args = [];
    for (let option of interaction.options.data) {
      if (option.type === ApplicationCommandOptionType.Subcommand) {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );
    if (cmd) {
      // checking user perms
      if (!interaction.member.permissions.has(cmd.userPermissions || [])) {
        return client.embed(
          interaction,
          `Você não tem a permissão \`${cmd.userPermissions}\` para usar este Comando!`
        );
      } else if (
        !interaction.guild.members.me.permissions.has(cmd.botPermissions || [])
      ) {
        return client.embed(
          interaction,
          `Eu não tenho a permissão \`${cmd.botPermissions}\` Para usar este Comando!`
        );
      } else if (cooldown(interaction, cmd)) {
        return client.embed(
          interaction,
          `Você está em Cooldown, espere \`${cooldown(
            interaction,
            cmd
          ).toFixed()}\` Segundos`);
      } else {
        cmd.run(client, interaction, args);
      }
    }
  }

  // Context Menu Handling
  if (interaction.isContextMenuCommand()) {
    await interaction.deferReply({ ephemeral: true }).catch((e) => {});
    const command = client.commands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }
});

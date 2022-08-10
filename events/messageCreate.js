const { cooldown } = require("../handlers/functions");
const client = require("..");
const { prefix: botPrefix, emoji } = require("../settings/config");

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || !message.id) return;
  let prefix = botPrefix;
  let mentionprefix = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
  );
  if (!mentionprefix.test(message.content)) return;
  const [, nprefix] = message.content.match(mentionprefix);
  const args = message.content.slice(nprefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) {
    if (nprefix.includes(client.user.id)) {
    }
  }
  const command =
    client.mcommands.get(cmd) ||
    client.mcommands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
  if (!command) return;
  if (command) {
    if (!message.member.permissions.has(command.userPermissions || [])) {
      return client.embed(
        message,
        `${emoji.ERROR} Você não tem a permissão \`${command.userPermissions}\` para usar este Comando!`
      );
    } else if (
      !message.guild.members.me.permissions.has(command.botPermissions || [])
    ) {
      return client.embed(
        message,
        `${emoji.ERROR} Eu não a permissão \`${command.botPermissions}\` para usar este Comando!`
      );
    } else if (cooldown(message, command)) {
      return client.embed(
        message,
        `*Você está em Cooldown, espere \`${cooldown(
          message,
          command
        ).toFixed()}\` Segundos*`);
    } else {
      command.run(client, message, args, nprefix);
    }
  }
});

function escapeRegex(newprefix) {
  return newprefix.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}

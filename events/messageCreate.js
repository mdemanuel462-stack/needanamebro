const prefix = '!';

module.exports = {
  name: 'messageCreate',

  async execute(message, client) {

    try {

      if (message.author.bot) return;

      if (!message.content.startsWith(prefix)) return;

      const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/);

      const commandName =
        args.shift()?.toLowerCase();

      if (!commandName) return;

      const command =
        client.commands.get(commandName);

      if (!command) return;

      await command.execute(
        message,
        args
      );

    } catch (err) {

      console.error(err);

      message.reply(
        '❌ Ocurrió un error'
      ).catch(() => {});
    }
  }
};

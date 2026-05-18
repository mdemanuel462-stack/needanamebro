const sticky = require('../handlers/sticky');

const prefix = '!';

module.exports = {
  name: 'messageCreate',

  async execute(message, client) {

    try {

      if (message.author.bot) return;

      const guildId =
        message.guild?.id;

      const channelId =
        message.channel?.id;

      if (
        guildId &&
        channelId &&
        sticky.data[guildId] &&
        sticky.data[guildId][channelId]
      ) {

        const stickies =
          sticky.data[guildId][channelId];

        for (const s of stickies) {

          try {

            if (
              message.id === s.lastId
            ) continue;

            if (s.lastId) {

              const oldMessage =
                await message.channel.messages
                  .fetch(s.lastId)
                  .catch(() => null);

              if (oldMessage) {

                await oldMessage
                  .delete()
                  .catch(() => {});
              }
            }

              const stickyMessage =
              await message.channel.send({
              content: `${s.text}`
                         });


            s.lastId =
              stickyMessage.id;

            s.uses =
              (s.uses || 0) + 1;

          } catch (err) {

            console.error(
              '❌ Error Sticky:',
              err
            );
          }
        }

        sticky.save();
      }

      if (
        !message.content.startsWith(prefix)
      ) return;

      const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/);

      const commandName =
        args.shift()?.toLowerCase();

      if (!commandName) return;

      const command =
        client.commands.get(
          commandName
        );

      if (!command) return;

      await command.execute(
        message,
        args
      );

    } catch (err) {

      console.error(
        '❌ Error messageCreate:',
        err
      );
    }
  }
};

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client) {

    try {


      if (interaction.isChatInputCommand()) {

const command =
  client.commands.get(
    interaction.commandName
  );

        if (!command) return;

        return await command.execute(
          interaction
        );
      }


      if (interaction.isButton()) {

        const id =
          interaction.customId;

        if (
          [
            'basic',
            'author',
            'footer',
            'images',
            'fields',
            'color',
            'preview',
            'undo',
            'send',
            'delete'
          ].includes(id)
        ) {

          return interaction.reply({
            content:
              `🧩 Botón presionado: ${id}`,
            ephemeral: true
          });
        }
      }


      if (interaction.isModalSubmit()) {

        return interaction.reply({
          content: '✅ Modal recibido',
          ephemeral: true
        });
      }


      if (
        interaction.isStringSelectMenu()
      ) {

        return interaction.reply({
          content:
            '✅ Select menu usado',
          ephemeral: true
        });
      }

    } catch (err) {

      console.error(err);

      if (
        interaction.replied ||
        interaction.deferred
      ) {

        interaction.followUp({
          content:
            '❌ Ocurrió un error',
          ephemeral: true
        }).catch(() => {});
      }

      else {

        interaction.reply({
          content:
            '❌ Ocurrió un error',
          ephemeral: true
        }).catch(() => {});
      }
    }
  }
};

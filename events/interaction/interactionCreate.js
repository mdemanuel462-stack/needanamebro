const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

const Session = require('../../models/editorSession');
const editor = require('../../systems/embedEditor');

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    }

    if (interaction.isButton()) {

      if (interaction.customId === 'basic') {
        const modal = new ModalBuilder()
          .setCustomId('modal_basic')
          .setTitle('Basic Info');

        modal.addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('title')
              .setLabel('Title')
              .setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('description')
              .setLabel('Description')
              .setStyle(TextInputStyle.Paragraph)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('color')
              .setLabel('Color (#FFBA4F)')
              .setStyle(TextInputStyle.Short)
          )
        );

        return interaction.showModal(modal);
      }

      if (interaction.customId === 'author') {
        const modal = new ModalBuilder()
          .setCustomId('modal_author')
          .setTitle('Author');

        modal.addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('author_name')
              .setLabel('Author name')
              .setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('author_icon')
              .setLabel('Author icon URL')
              .setStyle(TextInputStyle.Short)
          )
        );

        return interaction.showModal(modal);
      }

      if (interaction.customId === 'footer') {
        const modal = new ModalBuilder()
          .setCustomId('modal_footer')
          .setTitle('Footer');

        modal.addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('footer_text')
              .setLabel('Footer text')
              .setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('footer_icon')
              .setLabel('Footer icon URL')
              .setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('timestamp')
              .setLabel('Timestamp (yes/no)')
              .setStyle(TextInputStyle.Short)
          )
        );

        return interaction.showModal(modal);
      }

      if (interaction.customId === 'images') {
        const modal = new ModalBuilder()
          .setCustomId('modal_images')
          .setTitle('Images');

        modal.addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('image')
              .setLabel('Main image URL')
              .setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('thumbnail')
              .setLabel('Thumbnail URL')
              .setStyle(TextInputStyle.Short)
          )
        );

        return interaction.showModal(modal);
      }

      if (interaction.customId === 'undo') {

        const session = await Session.findOne({
          messageId: interaction.message.id
        });

        if (!session || !session.history || session.history.length === 0) {
          return interaction.reply({
            content: 'Nada que deshacer',
            ephemeral: true
          });
        }

        const last = session.history.pop();
        session.data = last;

        await session.save();

        return interaction.update({
          embeds: [session.data]
        });
      }

    }

    if (interaction.isModalSubmit()) {

      const session = await Session.findOne({
        messageId: interaction.message.id
      });

      if (!session) return;

      if (!session.history) session.history = [];

      if (interaction.customId === 'modal_basic') {

        const title = interaction.fields.getTextInputValue('title');
        const desc = interaction.fields.getTextInputValue('description');
        const color = interaction.fields.getTextInputValue('color');

        session.history.push({ ...session.data });

        session.data = {
          ...session.data,
          title,
          description: desc,
          color: parseInt(color.replace('#', ''), 16)
        };

        await session.save();

        return interaction.update({
          embeds: [session.data]
        });
      }

      if (interaction.customId === 'modal_author') {

        const name = interaction.fields.getTextInputValue('author_name');
        const icon = interaction.fields.getTextInputValue('author_icon');

        session.history.push({ ...session.data });

        session.data = {
          ...session.data,
          author: { name, icon_url: icon }
        };

        await session.save();

        return interaction.update({
          embeds: [session.data]
        });
      }

      if (interaction.customId === 'modal_footer') {

        const text = interaction.fields.getTextInputValue('footer_text');
        const icon = interaction.fields.getTextInputValue('footer_icon');
        const timestamp = interaction.fields.getTextInputValue('timestamp');

        session.history.push({ ...session.data });

        session.data = {
          ...session.data,
          footer: { text, icon_url: icon },
          timestamp: timestamp.toLowerCase() === 'yes' ? new Date() : undefined
        };

        await session.save();

        return interaction.update({
          embeds: [session.data]
        });
      }

      if (interaction.customId === 'modal_images') {

        const image = interaction.fields.getTextInputValue('image');
        const thumb = interaction.fields.getTextInputValue('thumbnail');

        session.history.push({ ...session.data });

        session.data = {
          ...session.data,
          image: { url: image },
          thumbnail: { url: thumb }
        };

        await session.save();

        return interaction.update({
          embeds: [session.data]
        });
      }

    }

  }
};

const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const editor = require('../../systems/embedEditor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Editor profesional estilo Mimu'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setColor('#FFBA4F')
      .setTitle('🧩 Embed Editor')
      .setDescription('Selecciona una opción para editar el embed');

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('basic')
        .setLabel('Basic')
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId('author')
        .setLabel('Author')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('footer')
        .setLabel('Footer')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('images')
        .setLabel('Images')
        .setStyle(ButtonStyle.Secondary)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('undo')
        .setLabel('Undo')
        .setStyle(ButtonStyle.Danger)
    );

    const msg = await interaction.reply({
      embeds: [embed],
      components: [row1, row2],
      fetchReply: true
    });

    await editor.createSession(
      msg.id,
      interaction.user.id,
      embed.data
    );

  }
};

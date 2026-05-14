const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ver latencia'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setColor('#FFBA4F')
      .setDescription(`🏓 Pong!\nLatencia: ${Date.now() - interaction.createdTimestamp}ms`);

    await interaction.reply({ embeds: [embed] });
  }
};

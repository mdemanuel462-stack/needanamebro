const { EmbedBuilder } = require('discord.js');
const sticky = require('../../handlers/sticky');

module.exports = {
  name: 'stickystats',

  async execute(message) {

    if (!message.guild) return;

    const data = sticky.data[message.guild.id]?.[message.channel.id];

    if (!data || data.length === 0) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FFBA4F')
            .setDescription('❌ No hay stickys en este canal')
        ]
      });
    }

    let text = '';

    data.forEach((s, i) => {
      text += `**#${i + 1}**\n🧷 ${s.text}\n🔁 Usos: ${s.uses || 0}\n\n`;
    });

    const embed = new EmbedBuilder()
      .setColor('#FFBA4F')
      .setTitle('📊 Sticky Stats')
      .setDescription(text)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  }
};

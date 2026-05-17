const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const sticky = require('../../handlers/sticky');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('stickystats')
    .setDescription('Ver estadísticas sticky'),

  name: 'stickystats',

  async execute(ctx) {

    if (!ctx.guild) return;

    const data =
      sticky.data[ctx.guild.id]?.[ctx.channel.id];

    if (!data || data.length === 0) {

      return ctx.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FFBA4F')
            .setDescription(
              '❌ No hay stickys en este canal'
            )
        ]
      });
    }

    let text = '';

    data.forEach((s, i) => {

      text +=
`### #${i + 1}
🧷 ${s.text}

🔁 Usos: ${s.uses || 0}
👤 <@${s.author}>
\n`;
    });

    const embed = new EmbedBuilder()
      .setColor('#FFBA4F')
      .setTitle('📊 Sticky Stats')
      .setDescription(text)
      .setFooter({
        text: `Total: ${data.length} stickys`
      })
      .setTimestamp();

    return ctx.reply({
      embeds: [embed]
    });
  }
};

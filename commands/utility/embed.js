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
    .setDescription('Editor profesional estilo'),
  name: 'embed',

  async execute(ctx) {

    const user =
      ctx.user || ctx.author;

    const embed = new EmbedBuilder()
      .setColor('#FFBA4F')
      .setAuthor({
        name: 'Embed Editor',
        iconURL: user.displayAvatarURL()
      })
      .setTitle('🧩 Professional Embed Editor')
      .setDescription(

      )
      .setThumbnail(user.displayAvatarURL())
      .setFooter({
        text: `Editor iniciado por ${user.username}`
      })
      .setTimestamp();

    const row1 = new ActionRowBuilder()
      .addComponents(

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

    const row2 = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('fields')
          .setLabel('Fields')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('color')
          .setLabel('Color')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('preview')
          .setLabel('Preview')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId('undo')
          .setLabel('Undo')
          .setStyle(ButtonStyle.Danger)
      );

    const row3 = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('send')
          .setLabel('Send Embed')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('delete')
          .setLabel('Delete')
          .setStyle(ButtonStyle.Danger)
      );

    let msg;

    if (ctx.commandName) {

      msg = await ctx.reply({
        embeds: [embed],
        components: [row1, row2, row3],
        fetchReply: true
      });
    }

    else if (ctx.content) {

      msg = await ctx.reply({
        embeds: [embed],
        components: [row1, row2, row3]
      });
    }

    await editor.createSession(
      msg.id,
      user.id,
      embed.data
    );
  }
};

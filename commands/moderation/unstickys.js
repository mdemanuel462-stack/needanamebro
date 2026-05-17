const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder
} = require('discord.js');

const sticky = require('../../handlers/sticky');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('unstickys')
    .setDescription('Eliminar un sticky')
    .addIntegerOption(option =>
      option
        .setName('numero')
        .setDescription('Número del sticky')
        .setRequired(true)
    ),

  name: 'unstickys',

  async execute(ctx, args) {

    if (!ctx.guild) return;

    if (
      !ctx.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {

      return ctx.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FFBA4F')
            .setDescription(
              '❌ No tienes permisos'
            )
        ]
      });
    }

    const g = ctx.guild.id;
    const c = ctx.channel.id;

    const data =
      sticky.data[g]?.[c];

    if (!data || data.length === 0) {

      return ctx.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FFBA4F')
            .setDescription(
              '❌ No hay stickys'
            )
        ]
      });
    }

    let index;

    if (ctx.commandName) {

      index =
        ctx.options.getInteger('numero') - 1;
    }

    else {

      index =
        parseInt(args[0]) - 1;
    }

    if (
      isNaN(index) ||
      !data[index]
    ) {

      return ctx.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FFBA4F')
            .setDescription(
              '❌ Sticky no encontrado'
            )
        ]
      });
    }

    const removed =
      data[index];

    data.splice(index, 1);

    sticky.save();

    const embed = new EmbedBuilder()
      .setColor('#FFBA4F')
      .setTitle('🗑️ Sticky Eliminado')
      .setDescription(
`### Sticky eliminado

> ${removed.text}`
      )
      .setTimestamp();

    return ctx.reply({
      embeds: [embed]
    });
  }
};

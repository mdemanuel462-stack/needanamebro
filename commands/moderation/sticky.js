const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder
} = require('discord.js');

const sticky = require('../../handlers/sticky');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sticky')
    .setDescription('Crear un sticky')
    .addStringOption(option =>
      option
        .setName('mensaje')
        .setDescription('Mensaje sticky')
        .setRequired(true)
    ),

  name: 'sticky',

  async execute(ctx, args) {
    const guild = ctx.guild;

    if (!guild) return;

    const member = ctx.member;
    const channel = ctx.channel;
    const user = ctx.user || ctx.author;

    if (
      !member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return ctx.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#2B2D31')
            .setDescription(
              '❌ No tienes permisos para usar este comando.'
            )
        ],
        ephemeral: true
      });
    }

    let text;

    if (ctx.commandName) {
      text = ctx.options.getString('mensaje');
    }

    else {
      text = args.join(' ');
    }

    if (!text) {
      return ctx.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#2B2D31')
            .setDescription(
              '❌ Debes escribir un mensaje.'
            )
        ]
      });
    }

    const g = guild.id;
    const c = channel.id;

    if (!sticky.data[g]) {
      sticky.data[g] = {};
    }

    if (!sticky.data[g][c]) {
      sticky.data[g][c] = [];
    }

    if (sticky.data[g][c].length >= 10) {
      return ctx.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#2B2D31')
            .setDescription(
              '❌ Solo puedes tener 10 stickys por canal.'
            )
        ]
      });
    }

    sticky.data[g][c].push({
      text,
      lastId: null,
      uses: 0,
      author: user.id,
      createdAt: Date.now()
    });

    sticky.save();

const embed = new EmbedBuilder()
      .setColor('#FFBA4F')
      .setDescription(
        ` Sticky creado en ${channel}\n\n> ${text}`
      );

    return ctx.reply({
      embeds: [embed]
    });
  }
};

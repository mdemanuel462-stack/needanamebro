const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder
} = require('discord.js');

const sticky = require('../../handlers/sticky');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('sticky')
    .setDescription('Crear un sticky profesional')
    .addStringOption(option =>
      option
        .setName('mensaje')
        .setDescription('Mensaje sticky')
        .setRequired(true)
    ),

  name: 'sticky',

  async execute(ctx, args) {

    const guild =
      ctx.guild;

    if (!guild) return;

    const member =
      ctx.member;

    const channel =
      ctx.channel;

    const user =
      ctx.user || ctx.author;

    const noPerms = new EmbedBuilder()
      .setColor('#FFBA4F')
      .setDescription(
        '❌ No tienes permisos para usar este comando'
      );

    if (
      !member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {

      if (ctx.commandName) {
        return ctx.reply({
          embeds: [noPerms],
          ephemeral: true
        });
      }

      return ctx.reply({
        embeds: [noPerms]
      });
    }

    let text;

    // Slash
    if (ctx.commandName) {

      text =
        ctx.options.getString('mensaje');
    }

    // Prefix
    else {

      text = args.join(' ');
    }

    if (!text) {

      return ctx.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FFBA4F')
            .setDescription(
              '❌ Debes escribir un mensaje'
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

    if (sticky.data[g][c].length >= 5) {

      return ctx.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FFBA4F')
            .setDescription(
              '❌ Máximo 5 stickys por canal'
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
      .setAuthor({
        name: 'Sticky System',
        iconURL: user.displayAvatarURL()
      })
      .setTitle('🧷 Sticky Activado')
      .setDescription(
`### Mensaje Sticky

> ${text}

### Información
👤 Creador: ${user}
📍 Canal: ${channel}
📌 Stickys actuales: ${sticky.data[g][c].length}/5`
      )
      .setFooter({
        text: `Sistema Sticky • ${guild.name}`
      })
      .setTimestamp();

    return ctx.reply({
      embeds: [embed]
    });
  }
};

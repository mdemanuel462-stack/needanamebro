const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const sticky = require('../../handlers/sticky');

module.exports = {
  name: 'sticky',

  async execute(message, args) {

    if (!message.guild) return;

    const error = (t) => message.channel.send({
      embeds: [new EmbedBuilder().setColor('#FFBA4F').setDescription(`❌ ${t}`)]
    });

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return error('No tienes permisos');
    }

    const text = args.join(' ').trim();
    if (!text) return error('Escribe un mensaje');

    const g = message.guild.id;
    const c = message.channel.id;

    if (!sticky.data[g]) sticky.data[g] = {};
    if (!sticky.data[g][c]) sticky.data[g][c] = [];

    if (sticky.data[g][c].length >= 5) {
      return error('Máximo 5 stickys');
    }

    sticky.data[g][c].push({
      text,
      lastId: null,
      uses: 0
    });

    sticky.save();

    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('#FFBA4F')
          .setDescription('🧷 Sticky activado')
      ]
    });
  }
};

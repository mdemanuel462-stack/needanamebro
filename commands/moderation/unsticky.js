const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const sticky = require('../../handlers/sticky');

module.exports = {
  name: 'unsticky',

  async execute(message) {

    if (!message.guild) return;

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FFBA4F')
            .setDescription('❌ No tienes permisos')
        ]
      });
    }

    const g = message.guild.id;
    const c = message.channel.id;

    if (!sticky.data[g] || !sticky.data[g][c]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FFBA4F')
            .setDescription('❌ No hay stickys en este canal')
        ]
      });
    }

    delete sticky.data[g][c];

    if (Object.keys(sticky.data[g]).length === 0) {
      delete sticky.data[g];
    }

    sticky.save();

    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('#FFBA4F')
          .setDescription('🗑️ Todos los stickys eliminados')
          .setTimestamp()
      ]
    });
  }
};

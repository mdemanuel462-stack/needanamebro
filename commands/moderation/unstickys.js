const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const sticky = require('../../handlers/sticky');

module.exports = {
  name: 'unstickys',

  async execute(message, args) {

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

    const index = parseInt(args[0]) - 1;

    if (isNaN(index)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FFBA4F')
            .setDescription('❌ Debes poner un número válido')
        ]
      });
    }

    const data = sticky.data[g]?.[c];

    if (!data || !data[index]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FFBA4F')
            .setDescription('❌ Sticky no encontrado')
        ]
      });
    }

    data.splice(index, 1);

    if (data.length === 0) {
      delete sticky.data[g][c];
    }

    sticky.save();

    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('#FFBA4F')
          .setDescription('🗑️ Sticky eliminado')
          .setTimestamp()
      ]
    });
  }
};

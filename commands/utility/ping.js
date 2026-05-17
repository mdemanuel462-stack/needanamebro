const { SlashCommandBuilder } = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde pong'),

  name: 'ping',

  async execute(ctx) {

    if (ctx.reply && ctx.commandName) {

      return ctx.reply('🏓 Pong Slash!');
    }

    if (ctx.reply && ctx.content) {

      return ctx.reply('🏓 Pong Prefix!');
    }
  }
};

require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Mongo conectado'))
  .catch(err => console.log(err));

require('./handlers/commandHandler')(client);
require('./handlers/eventHandler')(client);

client.login(process.env.TOKEN);

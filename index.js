require('dotenv').config();

const fs = require('fs');
const path = require('path');

const {
  Client,
  GatewayIntentBits,
  Collection
} = require('discord.js');


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

const commandFolders =
  fs.readdirSync('./commands');

for (const folder of commandFolders) {

  const folderPath =
    path.join('./commands', folder);

  if (!fs.lstatSync(folderPath).isDirectory()) continue;

  const files = fs
    .readdirSync(folderPath)
    .filter(file => file.endsWith('.js'));

  for (const file of files) {

    const command =
      require(`./commands/${folder}/${file}`);


    if (
      command.data &&
      command.execute
    ) {

      client.commands.set(
        command.data.name,
        command
      );

      console.log(
        `✅ Slash cargado: ${command.data.name}`
      );
    }

    if (
      command.name &&
      command.execute
    ) {

      client.commands.set(
        command.name,
        command
      );

      console.log(
        `✅ Prefix cargado: ${command.name}`
      );
    }
  }
}

const eventFiles = fs
  .readdirSync('./events')
  .filter(file => file.endsWith('.js'));

for (const file of eventFiles) {

  const event =
    require(`./events/${file}`);

  client.on(
    event.name,
    (...args) =>
      event.execute(...args, client)
  );

  console.log(
    `📌 Evento cargado: ${event.name}`
  );
}

client.once('ready', () => {

  console.log(
    `✅ Conectado como ${client.user.tag}`
  );
});

client.login(process.env.TOKEN);

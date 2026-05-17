require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('fs');

const commands = [];

const folders = fs.readdirSync('./commands');

for (const folder of folders) {

  const files = fs
    .readdirSync(`./commands/${folder}`)
    .filter(file => file.endsWith('.js'));

  for (const file of files) {

    const command = require(`./commands/${folder}/${file}`);

    if (!command.data) continue;

    commands.push(command.data.toJSON());
  }
}

const rest = new REST({
  version: '10'
}).setToken(process.env.TOKEN);

(async () => {

  try {

    console.log('🚀 Subiendo slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands
      }
    );

    console.log(`✅ ${commands.length} comandos registrados`);

  } catch (error) {

    console.error('❌ Error registrando comandos:');
    console.error(error);
  }
})();

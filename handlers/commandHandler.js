const fs = require('fs');

module.exports = (client) => {

  const folders = fs.readdirSync('./commands');

  for (const folder of folders) {

    const files = fs.readdirSync(`./commands/${folder}`).filter(f => f.endsWith('.js'));

    for (const file of files) {

      const command = require(`../commands/${folder}/${file}`);

      if (command.data) {
        client.commands.set(command.data.name, command);
      }

    }
  }
};

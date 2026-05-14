const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const eventFolders = fs.readdirSync('./events');

  for (const folder of eventFolders) {
    const files = fs.readdirSync(`./events/${folder}`).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const event = require(`../events/${folder}/${file}`);

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  }
};

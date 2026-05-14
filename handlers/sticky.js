const fs = require('fs');

let data = {};
let lock = {};

if (fs.existsSync('./sticky.json')) {
  data = JSON.parse(fs.readFileSync('./sticky.json'));
}

function save() {
  fs.writeFileSync('./sticky.json', JSON.stringify(data, null, 2));
}

async function handle(message) {

  if (!message.guild) return;
  if (message.author.bot) return;

  const guildId = message.guild.id;
  const channelId = message.channel.id;

  const list = data[guildId]?.[channelId];
  if (!list || list.length === 0) return;

  if (message.content.startsWith('!')) return;

  const key = guildId + channelId;

  if (lock[key]) return;
  lock[key] = true;

  try {

    for (const s of list) {

      if (s.lastId) {
        await message.channel.messages.delete(s.lastId).catch(() => {});
      }

      await new Promise(r => setTimeout(r, 150));

      const msg = await message.channel.send(s.text);

      s.lastId = msg.id;
      s.uses = (s.uses || 0) + 1;
    }

    save();

  } catch (e) {}

  setTimeout(() => {
    lock[key] = false;
  }, 1000);
}

module.exports = { handle, data, save };

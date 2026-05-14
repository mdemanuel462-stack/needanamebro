const mongoose = require('mongoose');

const embedSchema = new mongoose.Schema({
  guildId: String,
  name: String,
  data: Object
});

module.exports = mongoose.model('Embed', embedSchema);

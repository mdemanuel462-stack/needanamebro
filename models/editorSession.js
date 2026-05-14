const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  messageId: String,
  userId: String,
  data: Object,
  history: Array
});

module.exports = mongoose.model('EditorSession', schema);

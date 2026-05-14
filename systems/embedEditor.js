const Session = require('../models/editorSession');

async function getSession(messageId) {
  return await Session.findOne({ messageId });
}

async function createSession(messageId, userId, data) {
  return await Session.create({
    messageId,
    userId,
    data,
    history: []
  });
}

async function ensureSession(messageId, userId, data) {
  let session = await getSession(messageId);

  if (!session) {
    session = await createSession(messageId, userId, data);
  }

  if (!session.history) session.history = [];

  return session;
}

async function updateSession(session, newData) {
  session.history.push({ ...session.data });

  session.data = {
    ...session.data,
    ...newData
  };

  await session.save();

  return session.data;
}

async function undoSession(session) {
  if (!session.history || session.history.length === 0) return null;

  const last = session.history.pop();
  session.data = last;

  await session.save();

  return session.data;
}

module.exports = {
  getSession,
  createSession,
  ensureSession,
  updateSession,
  undoSession
};

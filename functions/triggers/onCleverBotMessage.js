const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();

const bot = {
  displayName: 'cleverbot',
  photoURL: 'https://i.imgur.com/yd0MC2c.png',
  uid: 'cleverbot',
  status: {
    lastChanged: new Date(),
    state: 'online'
  },
  channels: {
    general: true
  }
};

db.collection('users')
  .doc(bot.uid)
  .set(bot, { merge: true });

module.exports = functions.firestore
  .document('channels/general/messages/{messageId}')
  .onCreate((doc, context) => {
    const message = doc.data();
    if (!message.text.startsWith('@cleverbot')) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return db.collection('channels/general/messages').add({
      text: 'hey, whats up?',
      user: db.collection('users').doc('cleverbot'),
      createdAt: new Date()
    });
  });

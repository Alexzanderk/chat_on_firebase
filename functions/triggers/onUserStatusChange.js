const functions = require('firebase-functions');
const admin = require('firebase-admin');

// admin.initializeApp();

const db = admin.firestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

module.exports = functions.database
  .ref('/status/{userId}')
  .onUpdate((change, context) => {
    const eventStatus = change.after.val();
    const userDoc = db.doc(`users/${context.params.userId}`);

    return change.after.ref.once('value').then(snapshot => {
      const status = snapshot.val();
      // eslint-disable-next-line promise/always-return
      if (status.lastChange > eventStatus.lastChange) {
        return;
      }
      eventStatus.lastChange = new Date(eventStatus.lastChange);
      userDoc.update({ status: eventStatus });
    });
  });
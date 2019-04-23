import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyBSn43lCCnLLIlzBkNTtB799vAPGuMmJtk',
  authDomain: 'chat-app-1ca03.firebaseapp.com',
  databaseURL: 'https://chat-app-1ca03.firebaseio.com',
  projectId: 'chat-app-1ca03',
  storageBucket: 'chat-app-1ca03.appspot.com',
  messagingSenderId: '472495760699'
};

firebase.initializeApp(config);

const db = firebase.firestore();
const rtdb = firebase.database();

function setupPresence(user) {
  const isOfflineForRTDB = {
    state: 'offline',
    lastChange: firebase.database.ServerValue.TIMESTAMP
  };

  const isOnlineForRTDB = {
    state: 'online',
    lastChange: firebase.database.ServerValue.TIMESTAMP
  };

  const isOfflineForFirestore = {
    state: 'offline',
    lastChange: firebase.firestore.FieldValue.serverTimestamp()
  };

  const isOnlineForFirestore = {
    state: 'online',
    lastChange: firebase.firestore.FieldValue.serverTimestamp()
  };

  const rtdbRef = rtdb.ref(`/status/${user.uid}`);
  const userDoc = db.doc(`/users/${user.uid}`);

  rtdb.ref('.info/connected').on('value', async snapshot => {
    if (snapshot.val() === false) {
      userDoc.update({
        status: isOfflineForFirestore
      });
      return;
    }
    await rtdbRef.onDisconnect().set(isOfflineForRTDB);

    rtdbRef.set(isOnlineForRTDB);
    userDoc.update({
      status: isOnlineForFirestore
    });
  });
}

export { db, firebase, setupPresence };

const admin = require('firebase-admin');
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.onUserStatusChanged = require('./triggers/onUserStatusChange');
exports.onCleverBotMessage = require('./triggers/onCleverBotMessage');

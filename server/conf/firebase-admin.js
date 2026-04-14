const admin = require('firebase-admin');

// To initialize this in production, you should set FIREBASE_SERVICE_ACCOUNT_JSON 
// in your environment (as a stringified JSON) or place a serviceAccountKey.json 
// in this server/conf folder.

try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    : require('./serviceAccountKey.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (err) {
  // Graceful fallback for local development if the file is missing
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    console.warn('⚠️  Firebase Admin SDK not initialized: Missing serviceAccountKey.json or FIREBASE_SERVICE_ACCOUNT_JSON env var.');
  } else {
    console.error('❌ Failed to initialize Firebase Admin SDK:', err.message);
  }
}

module.exports = admin;

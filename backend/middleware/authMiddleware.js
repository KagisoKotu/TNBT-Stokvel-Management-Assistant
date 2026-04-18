const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll get this JSON from Firebase Console)
admin.initializeApp({
  credential: admin.credential.cert(require('./backend/serviceAccountKey.json'))
});

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).send("Unauthorized");

  try {
    // Firebase verifies the token for you!
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // This contains the UID
    next();
  } catch (error) {
    res.status(401).send("Invalid Token");
  }
};
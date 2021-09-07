import admin from "firebase-admin";
import fs from "fs";

const serviceAccountKey = JSON.parse(
  fs.readFileSync("./firebaseServiceAccountKey.json")
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

export default admin;

const admin = require("firebase-admin");
const serviceAccount = require("./shana-app-firebase-adminsdk-6cdd8-60d0177d7b.json");

const connectToFCM = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://shana-app.firebaseio.com"
  });
}

const sendNotification = (token, message) => {
  const payload = { notification : { body : "ShanaApp", title : message}};

  admin.messaging().sendToDevice(token, payload)
    .then(function(response) {
      console.log("Notification successfully sent:", response);
    })
    .catch(function(error) {
      console.log("Error sending notification:", error);
    });
}

module.exports = {
  connectToFCM: connectToFCM,
  sendNotification: sendNotification
}

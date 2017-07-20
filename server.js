const admin = require("firebase-admin");
const serviceAccount = require("./shana-app-firebase-adminsdk-6cdd8-60d0177d7b.json");

const express = require('express')
const bodyParser = require('body-parser')
const mongoUtil = require('./utils/mongoUtil.js');

const port = process.env.PORT || 3000
const app = express()

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://shana-app.firebaseio.com"
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/register', function (request, response) {
  console.log(request.body);
  registerInformation(request.body, (error) => {
    console.log(error);
    response.send('Hello World!');
  })
})

const registerInformation = (body, callback) => {
  const token = body.token;
  const db = mongoUtil.getDb();
  db.collection('users').findOne({token: token}, (error, result) => {
    if (error || result == null) {
      db.collection('users').insertOne(body, (error, result) => {
        return callback(error);
      })
    } else {
      db.collection('users').updateOne({token: token}, {$set: body}, (error, result) => {
        return callback(error);
      })
    }
  })
}

mongoUtil.connectToServer((err) => {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error: ', err)
  } else {
    //só inicia o servidor caso consiga connectar ao banco de dados primeiro
    registerInformation({token: "token2", url: "http://new", platform: "server++"}, (error) => {
      console.log(error);
    })

    // app.listen(port, function () {
    //   console.log('Example app listening on port 3000!')
    // })
  }
})

// This registration token comes from the client FCM SDKs.
// var registrationToken = "eZ2ZgwssHL8:APA91bEIfh2SbDfpaD-MNt2cY5R72GpG-kaT4ryYXglW2nrdtLRd-oQRwX5W7eIpGJLBkGaFKtHUOkLi6bhWdHxTvR6eBSfmZvkt9CzxdopoFZ_e6kzw792tutBavGPhFM02jAJ4-6rZ";

// // See the "Defining the message payload" section below for details
// // on how to define a message payload.
// var payload = {
//   notification : {
//     body : "great match!",
//     title : "Portugal vs. Denmark",
//     icon : "myicon"
//   }
// };
//
// // Send a message to the device corresponding to the provided
// // registration token.
// admin.messaging().sendToDevice(registrationToken, payload)
//   .then(function(response) {
//     // See the MessagingDevicesResponse reference documentation for
//     // the contents of response.
//     console.log("Successfully sent message:", response);
//   })
//   .catch(function(error) {
//     console.log("Error sending message:", error);
//   });

const express = require('express')
const bodyParser = require('body-parser')

const notification = require('./notification.js');
const database = require('./database.js');
const util = require('./utils/util.js');

const httpRequest = require('request')
const xmlParser = require('xml-js')

const port = process.env.PORT || 3000
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/register', (request, response) => handleRegister(request.body, response));

const handleRegister = (body, response) => {
  checkUrl(body.url, (error, titles) => {
    const user = Object.assign(body, {titles: titles})
    database.registerUser(user, (error, result) => {
      if (error) {
        console.log(`${error.name}: ${error.message}`);
        return response.send({error: `${error.name}: ${error.message}`});
      }
      return response.send({status: true});
    });
  });
}

const checkUrl = (url, callback) => {
  httpRequest(url, (error, response, body) => {
    if (!error) {
      const jsonString = xmlParser.xml2json(body, {compact: false, spaces: 4});
      const json = JSON.parse(jsonString);
      const listOfTitleObjects = util.getIn(json, ['elements', 'rss', 'elements', 'channel', 'elements'])
                                      .filter((el) => el.name == 'item')
                                      .map((el) => util.getIn(el, ['elements', 'title', 'elements']))

      const regex = /.*\ -\ [0-9]+/;
      const titles = util.flatten(listOfTitleObjects).map((el) => el.text);
      const formattedTitles = titles.map((el) => {
        const match = el.match(regex);
        return match ? match[0] : el;
      });
      callback(null, formattedTitles);
    }
  })
}

const checkForNotifications = () => {
  database.getAllUsers((error, users) => {
    if (users.length == 0) {
      return;
    }
    users.forEach((user, index) => {
      checkUrl(user.url, (error, titles) => {
        const newTitles = util.diff(titles, user.titles);
        if (newTitles.length > 0) {
          const message = newTitles.length > 1 ? `${newTitles.length} new episodes available!` : `${newTitles[0]} available!`;
          notification.sendNotification(user.token, message);
        }

        const newUser = Object.assign(user, {titles: titles});
        database.registerUser(newUser, (error, result) => {
          if (error) {
            console.log(error);
          }
        })
      })
    })
  });
}

mongoUtil.connectToServer((err) => {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error: ', err)
  } else {
    notification.connectToFCM();

    app.listen(port, function () {
      console.log('Example app listening on port 3000!')
    })

    checkForNotifications();
    // const mainLoop = setInterval(checkForNotifications, 2 * 60 * 60 * 1000)
  }
})

// This registration token comes from the client FCM SDKs.
// var registrationToken = "eZ2ZgwssHL8:APA91bEIfh2SbDfpaD-MNt2cY5R72GpG-kaT4ryYXglW2nrdtLRd-oQRwX5W7eIpGJLBkGaFKtHUOkLi6bhWdHxTvR6eBSfmZvkt9CzxdopoFZ_e6kzw792tutBavGPhFM02jAJ4-6rZ";

// // See the "Defining the message payload" section below for details
// // on how to define a message payload.

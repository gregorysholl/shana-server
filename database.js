const mongoUtil = require('./utils/mongoUtil.js');
const db = mongoUtil.getDb();

const registerUser = (object, callback) => {
  const token = object.token;
  db.collection('users').findOne({token: token}, (error, result) => {
    if (error || result == null) {
      db.collection('users').insertOne(object, (error, result) => {
        return callback(error, result);
      })
    } else {
      db.collection('users').updateOne({token: token}, {$set: object}, (error, result) => {
        return callback(error, result);
      })
    }
  })
}

const getAllUsers = (callback) => {
  db.collection('users').find((error, result) => {
    if (error) {
      return callback(error, []);
    }
    return callback(null, result);
  });
}

module.exports = {
  registerUser: registerUser,
  getAllUsers: getAllUsers
}

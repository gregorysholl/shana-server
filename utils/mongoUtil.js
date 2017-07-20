const mongodb = require('mongodb')
const dbClient = mongodb.MongoClient

var _db;

const connectToServer = (callback) => {
  dbClient.connect('mongodb://localhost:27017/shana', (err, db) => {
    _db = db
    return callback(err)
  })
}

const getDb = () => {
  return _db
}

const getObjectId = (id) => {
  return mongodb.ObjectID(id)
}

module.exports = {
  connectToServer: connectToServer,
  getDb: getDb,
  getObjectId: getObjectId
}

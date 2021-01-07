var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var connectionSchema = new Schema({

  connectionID : String,
  connectionName : String,
  category : String,
  host : String,
  details : String,
  place : String,
  dateTime : String,
  eventImage : String,
  userID: String
});

module.exports = mongoose.model('connections',connectionSchema);
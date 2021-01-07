var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var conSchema= new Schema({
    connectionID : String,
    connectionName : String,
    category : String,
    rsvp : String
})
var userProfileSchema = new Schema({
  userID : String,
  userConnections:[conSchema]
});

module.exports = mongoose.model('userprofiles',userProfileSchema);
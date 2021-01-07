var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passwordSchema = new Schema({
  salt:String,
      passwordHash:String
})
var userSchema = new Schema({
  userID : String,
  firstName : String,
  lastName : String,
  email : String,
  address : String,
  password : passwordSchema
});

module.exports=mongoose.model('users',userSchema);

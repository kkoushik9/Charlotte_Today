var user = require('./../model/User');
var userModel= require('../model/User.model');



var getUser = async function(username) {
    var userFound;
    await userModel.findOne({$or:[{ 'email': username },{ 'userID': username }]}).exec().then((userRet) => {
        if (userRet) {
            userFound = new user.User(userRet.userID, userRet.firstName, userRet.lastName, userRet.email, userRet.address, userRet.password);
        }
    }).catch((err) => {
        console.log(err);
    });
    return userFound;
}

module.exports.getUser = getUser;

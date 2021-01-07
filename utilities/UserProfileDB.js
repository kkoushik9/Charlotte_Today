
var connectionDB = require('./connectionDB');
var UserProfiles = require('../model/Userprofile.model');
var Connection= require('../model/Connection.model');


var getUserProfile = async function (userId) {
  var userProfFound = [];
  await UserProfiles.find({ userID: userId }).exec().then((userProfRet) => {
    var profilesData = userProfRet[0].userConnections;
    if (profilesData) {
      userProfRet[0].userConnections.forEach((item) => {
        userProfFound.push(item);
      });
    }

  }).catch((err) => {
    console.log(err);
  });

  return userProfFound;
}

var addRSVP = async function (connectionObject, rsvp, userId) {
var added=null;
  await UserProfiles.updateOne({ userID: userId, 'userConnections.connectionID': { $ne: connectionObject.connectionID } },
    { $push: { userConnections: { connectionID: connectionObject.connectionID, connectionName: connectionObject.connectionName, category: connectionObject.category, rsvp: rsvp } } }).exec().then((result) => {
      added= result;
    }).catch((err) => {
      console.log(err);
    });

    return added;
}



var updateRSVP = async function (connectionObject, rsvp, userId) {
  var updated=null;
  await UserProfiles.updateOne({ userID: userId, "userConnections.connectionID": connectionObject.connectionID },
    { $set: { "userConnections.$.rsvp": rsvp } }).exec().then((result) => {
      updated= result;
    }).catch((err) => {
      console.log(err);
    });
    return updated;
}

var removeConnection = function ( connectionID, userID) {
  return UserProfiles.updateOne({ userID: userID },
    { $pull: { userConnections: { connectionID: connectionID } } });
};



var addConnection = function (connection, userID) {
  return Connection.findOneAndUpdate(
    {connectionName:connection.connectionName,category:connection.category},
    {connectionID:connection.connectionID, 
       connectionName:connection.connectionName, 
       category:connection.category,
       host:connection.host,
       details:connection.details,
       place:connection.place,
       dateTime:connection.dateTime,
       eventImage: connection.eventImage,
       userID:userID },
    {upsert: true, new: true, runValidators: true}).exec().then((result)=>{
      return UserProfiles.findOne({userID:userID}).exec().then((found)=>{
          if(found){
            return UserProfiles.updateOne({ "userID": userID,"userConnections.connectionID" : {$ne: connection.connectionID}},
             { $push: { userConnections: {"connectionID": connection.connectionID, "connectionName":connection.connectionName, "category":connection.category, "rsvp": "YES" }}}).exec().then((res)=>{
             return res;
             });
          }
          else{

          return UserProfiles.findOneAndUpdate({"userID":userID}, {
             "userID": userID,
             "userConnections" : [{connectionID:connection.connectionID , connectionName:connection.connectionName, category:connection.category, rsvp:'YES'}]
          }, {upsert: true, new: true, runValidators: true}).exec().then((data)=>{
           return data;
          })
          }
       })
    });
}



module.exports.getUserProfile = getUserProfile;
module.exports.addRSVP = addRSVP;
module.exports.updateRSVP = updateRSVP;
module.exports.removeConnection = removeConnection;
module.exports.addConnection = addConnection;

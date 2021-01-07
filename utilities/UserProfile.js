var UserConnection = require('../model/UserConnection');
var connection = require('../model/connection');
var connectionData = require('../model/connection');
var userProfileDB = require('./userProfileDB');
var connectionDB = require('./connectionDB');
var userID;
var userConnections;


class UserProfileClass {
  constructor(userID, userConnections) {
    this.userID = userID;
    this.userConnections = userConnections;

  }

 get getUserID() {
    return this.userID
  }
 set setUserID(value) {
    this.userID = value;
  }

  // getUserConnections() {
  //   return this.userConnections;
  // }
  // setUserConnections(list) {
  //   this.userConnections = list;
  // }


async  addConnection(connection, rsvp) {
    // if (connection != undefined) {
    //   var userConnList = [];
    //   if (this.getUserConnections() == undefined || this.getUserConnections().length == 0) {
    //     userConnList.push(new UserConnection.UserConnection(connection, rsvp));
    //     console.log(userConnList);
    //   } else {
    //     var data = this.getUserConnections();
    //     data.forEach(function (item) {
    //       userConnList.push(item);
    //     });
    //     userConnList.push(new UserConnection.UserConnection(connection, rsvp));
    //   }
    //   this.setUserConnections(userConnList);
    // }
  await  userProfileDB.addNewUserConnection(connection, this.userID, rsvp);
  }

  async updateRsvp(connection, rsvp) {

  await userProfileDB.updateRSVP(this.userID, connection.connectionID, rsvp);
  }

 async removeConnection(connection) {
    // this.setUserConnections(this.getUserConnections().filter(item => item.connection.connectionID != connection.getConnectionId));
  await  userProfileDB.removeConnection(this.userID, connection.connectionID);
  }

async getUserConnections() {
    // return this.userConnections;
    var uconns=[];
    var upro = await userProfileDB.getUserProfile(this.userID);
    upro.forEach((item)=>{
      uconns.push(new UserConnection.UserConnection(new connection.Connection(item.connectionID,item.connectionName,item.category,'','','','',''),item.rsvp));
    });
      this.userConnections = uconns
        return this.userConnections;
  }




}

module.exports = {
  UserProfile: UserProfileClass
}

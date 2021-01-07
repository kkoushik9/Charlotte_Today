var connection = require('./../model/connection');
var connectionsModel =require('./../model/Connection.model');


var getConnection=async function(connectionID){
  var connectionObject;
   await connectionsModel.findOne({ connectionID:connectionID }).exec().then((data) => {
     connectionObject = data;
     console.log("Connection found for the ID "+connectionID+" :"+connectionObject);

}).
catch(err => console.log('Caught:', err.message));
return connectionObject;
};

var getLastConnectionIdByCategory=async function(name){
  var connectionObject;
   await connectionsModel.find({connectionID:{ $regex: name + '.*' }},{connectionID:1,_id:0}).sort({connectionID: -1}).limit(1).exec().then((data) => {
     connectionObject = data;
     console.log("Connection ID:"+connectionObject);
    return connectionObject;
}).
catch(err => console.log('Caught:', err.message));
return connectionObject;
};

var getConnections = async function(){
  var connList = [],cc=[];
 await connectionsModel.find({}).exec().then((connsRet) => {
   cc=connsRet;
   console.log("data from db: "+connsRet);
for(i=0;i<cc.length;i++){
  var co = new connection.Connection(cc[i].connectionID, cc[i].connectionName, cc[i].category, cc[i].details, cc[i].dateTime,cc[i].host, cc[i].place, cc[i].eventImage);
  connList.push(co);
}
}).
catch(err => console.log('Caught:', err.message));
console.log("returned list: "+connList);

return connList;
};



var addtopics = async function(){
     var topics =[];
  await connectionsModel.distinct("category").exec().then((itemsRet) => {
    console.log("categories from DB: "+itemsRet);
    dd=itemsRet;
    for(i=0;i<dd.length;i++){
      topics.push(dd[i]);
    }
   }).
   catch(err => {console.log('Caught:', err.message)});
   console.log("Returned Topics"+topics);

return topics;
};

module.exports.getConnections = getConnections;
module.exports.getConnection = getConnection;
module.exports.addCategories = addtopics;
module.exports.connectionDB = connectionsModel;
module.exports.getLastConnectionIdByCategory=getLastConnectionIdByCategory;

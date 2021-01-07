var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var connection = require('../model/connection.js');
var userConnection = require('../model/UserConnection.js');
var user = require('../model/User.js');
var connectionDB = require('../utilities/connectionDB.js');
var userProfileDB = require('../utilities/UserProfileDB.js');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var userDB = require('../utilities/UserDB');
var random = require('random');
var crypto = require('crypto');
const { check, validationResult } = require('express-validator');



var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

router.get('/signup', function (req, res) {
  res.redirect('/login');
});

router.get('/login', function (req, res) {
  req.session.destroy();
  res.render('login',{error: null});
});

 router.post('/login', urlencodedParser,
[check('username').isEmail().withMessage('Enter a valid Username'), check('password').isAlphanumeric().withMessage('invalid').isLength({ min: 5 }).withMessage('invalid')],
 async function (req, res) {
   const errorResult = validationResult(req);
       var errors = errorResult.errors;
         if (!errorResult.isEmpty()) {
           // console.log('entered error');
          res.render('login', { error: errors });
         }
           else
           {
  var presentUser = await userDB.getUser(req.body.username);
  var entered_password_hash = sha512(req.body.password,presentUser.password.salt);
  if(presentUser!=undefined)
  {
    if(presentUser.password.passwordHash === entered_password_hash.passwordHash){
    req.session.currentUser = new user.User(presentUser.userID, presentUser.firstName, presentUser.lastName, presentUser.email, presentUser.address, '');
    // console.log('entered_password_hash : '+entered_password_hash.passwordHash);
    // console.log('database_password_hash : '+presentUser.password.passwordHash);
    res.redirect('savedConnections');
  }
  else {
    // console.log('entered_password_hash : '+entered_password_hash.passwordHash);
    // console.log('database_password_hash : '+presentUser.password.passwordHash);
    res.render('login', { error: true });
  }
}
  else {
    res.render('login', { error: true });
  }

}});

router.get('/logout', function (req, res) {
  req.session.destroy();
  var done = null
  res.render('index', { session: done });
});

router.get('/savedConnections', async function (req, res) {
  if (req.session.currentUser != undefined) {
    var currentUser = req.session.currentUser;
    var userConnections = await userProfileDB.getUserProfile(currentUser.userID);
    res.render('savedConnections', { userConnections: userConnections, session: currentUser });
  }
  else {
    res.redirect('/login')
  }
});

router.post('/savedConnections',check('id').isAlphanumeric().withMessage("Invalid connection ID"), urlencodedParser, async function (req, res) {
  var errors = validationResult(req);
  var currentUser = req.session.currentUser;
  var connectionId = req.query.id;
  if (!connectionId) {
    res.redirect('savedConnections');
  } else {
    var response = req.body.rsvp;
    var connectionObj = await connectionDB.getConnection(connectionId);
    if(connectionObj){
      if (response) {
        var updated = await userProfileDB.updateRSVP(connectionObj, response, currentUser.userID);
        if (updated.n == 0) {
          var added = await userProfileDB.addRSVP(connectionObj, response, currentUser.userID);
        }
      }
      else {
        await userProfileDB.removeConnection(connectionObj.connectionID, currentUser.userID);
      }
      res.redirect('savedConnections');
    }else{
      if(!errors.isEmpty()){
      console.log(errors.array());}
      res.redirect('connections');
    }

  }

});


router.post('/newConnection', urlencodedParser,[
  check('connectionName').isLength({ min: 1 }).withMessage('name too short'),
  check('category').exists().withMessage('please select a category'),
  check('details').isLength({ min: 10 }).withMessage('description too short'),
  check('place').isLength({ min: 3 }).withMessage('Enter a valid place'),
  check('dateTime').isLength({ min: 3 }).withMessage('Enter a valid dateTime')
],async function (req, res) {

  const errorResult = validationResult(req);
      var errors = errorResult.errors;
        if (!errorResult.isEmpty()) {

          res.render('newConnection',{session:req.session.currentUser,errors:errors});


        }

else{
  if (req.body != undefined) {
    var name = req.body.connectionName;
    var category = req.body.category;
    var details = req.body.details;
    var dateTime = req.body.dateTime;
    var place = req.body.place;
    var connectionId = "";
    var newId = "";
    if (category == "Current Event") {
      connectionId = "event";
      var lastId = await connectionDB.getLastConnectionIdByCategory(connectionId);
      var length = lastId[0].connectionID.length;
      var subString = lastId[0].connectionID.substring(length - 2, length);
      newId = parseInt(subString) + 1;
    }
    else if (category == "Upcoming events") {
      connectionId = "upEvent";
      var lastId = await connectionDB.getLastConnectionIdByCategory(connectionId);
      var length = lastId[0].connectionID.length;
      var subString = lastId[0].connectionID.substring(length - 2, length);
      newId = parseInt(subString) + 1;
    }
    if (newId <= 9) {
      connectionID = connectionId + "0" + newId;
    }
    else {
      connectionID = connectionId + newId;
    }
    var userID = (req.session.currentUser).userID;
    var host=req.session.currentUser.firstName+ " "+req.session.currentUser.lastName;
    var con = new connection.Connection(connectionID, name, category, details, dateTime,host, place,"/assets/images/newConnection.jpg");
    userProfileDB.addConnection(con, userID).then((response)=>{
      res.redirect('savedConnections');
    })

  }
  else {
    response.redirect('404Error');
  }

}});

router.get('/*', function (req, res) {
  res.render('404Error', { session: req.session.currentUser });
});

module.exports = router;

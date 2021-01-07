var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var connectionDB = require('./../utilities/connectionDB');
var connectionModel = require('./../model/connection')
var UserProfileDB = require('./../utilities/UserProfileDB')
const { check, validationResult } = require('express-validator');


router.get(['/index','/'],function(req,res){
  res.render('index',{session:req.session.currentUser});
});

router.get('/about',function(req,res){
  res.render('about',{session:req.session.currentUser});
});

router.get('/contact',function(req,res){
  res.render('contact',{session:req.session.currentUser});
});

router.get('/newConnection',function(req,res){
  if(req.session.currentUser){
  res.render('newConnection',{session:req.session.currentUser,errors:null});
}
else {
  {
    res.render('login',{session:req.session.currentUser});
  }
}
});







router.get('/connection',check('id').isAlphanumeric().withMessage("Invalid connection ID"),async function(request,response){
  var errors = validationResult(request);
  if ((Object.keys(request.query)).length != 0) {
    console.log(request.query);
    var conn_n = await connectionDB.getConnection(request.query.id);
    if (conn_n==null || conn_n.connectionID == undefined)
    {
      if(!errors.isEmpty()){
      console.log(errors.array());}
      response.redirect('Connections');
    }
    else{
      response.render('connection',{connectionDetails: conn_n,session: request.session.currentUser});
    }
  }
  else {
    response.render('Connections', {myConnections:myConnections, myCategories:myCategories,session: request.session.currentUser});
  }
});

router.post('/connection',check('id').isAlphanumeric().withMessage("Invalid connection ID"),async function(request,response){
  var errors = validationResult(request);
  if ((Object.keys(request.query)).length != 0) {
    console.log(request.query);
    var conn_n = await connectionDB.getConnection(request.query.id);
    if (conn_n==null || conn_n.connectionID == undefined)
    {
      if(!errors.isEmpty()){
      console.log(errors.array());}
      response.redirect('Connections');
    }
    else{
      response.render('connection',{connectionDetails: conn_n,session: request.session.currentUser});
    }
  }
  else {
    response.render('Connections', {myConnections:myConnections, myCategories:myCategories,session: request.session.currentUser});
  }
});

router.get('/Connections',async function(request,response){
  var conn_list=await connectionDB.getConnections();
  var cat_list=await connectionDB.addCategories();
  response.render('Connections', {myConnections:conn_list, myCategories:cat_list,session: request.session.currentUser});
});

router.post('/Connections',urlencodedParser, function(req,res){
    var number;
    connectionDB.connectionDB.find({}).count().exec().then(num=>{number = num; number++;}).catch(err=>{console.log(err);});
    if(req.session.currentUser){
      var newConnOfUser = new connectionModel.Connection(
         number,
        req.body.connectionName,
         req.body.category,
           req.body.details,
             req.body.dateTime,
       req.session.currentUser.firstName,
        req.body.place,
        '/assets/images/newConnection.jpg'
      );
      UserProfileDB.addConnection(newConnOfUser);
      res.redirect('/Connections')
    }
    else{
      res.redirect('/login');
    }
});



module.exports = router;

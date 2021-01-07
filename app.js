var express = require('express');
var app = express();
var mongoose = require('mongoose');
var helmet = require('helmet')

app.use(helmet())
app.set('view engine','ejs');
app.use('/assets',express.static('assets'));
var session = require('express-session');
app.use(session({secret: "kvsk"}));
var controller = require('./routes/controller');
var UserController = require('./routes/UserController');
var db = 'mongodb://localhost/charlotte_today';
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: false });
mongoose.Promise = global.Promise;

app.use('/',controller);
app.use('/',UserController);


app.listen(3000, function(){
  console.log('listening to port 3000')
});

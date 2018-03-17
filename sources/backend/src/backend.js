// This code is based on https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
//
// backend.js

// BASE SETUP
// =============================================================================

// load the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

var app = express();                 // define our app using express
var USERS = path.join(__dirname, 'users.json');
var PETS = path.join(__dirname, 'pets.json');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', process.env.PORT || 9090);        // set our port

// MIDDLEWARE for accessing the server from other servers
app.use(function(req, res, next) {
    console.log("in middleware!");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

function readData(DATAFILE, next, callback) {
    fs.readFile(DATAFILE, 'utf8', function(err, data) {
        if (err || !data) { return next(err); }

        callback(JSON.parse(data));
    });
}

function writeData(DATAFILE, data, res, next, message) {
    fs.writeFile(DATAFILE, JSON.stringify(data), function(err) {
        if (err) { return next(err); }
        res.json({message: message});
    });
}

// test route to make sure everything is working (accessed at GET http://localhost:5555/api)
router.get('/', function (req, res) {
  res.json({message: 'hooray! welcome to our api!'});
});

router.get('/pets', function(req, res, next) {
  readData(PETS, next, function(data){ return res.json(data); });
});

router.post('/pets', function(req, res, next) {
  readData(PETS, next, function(pets) {
    pets.push(req.body.pet);
    writeData(PETS, pets, res, next, "Pet successfully added");
  });
});

router.delete('/pets', function(req, res, next) {
    readData(PETS, next, function(pets) {
        writeData(PETS, pets /* TODO */, res, next, "Pet successfully deleted");
    });
});

// -------------------------------------

router.post('/user', function(req, res, next) {
  fs.readFile(USERS, function(err, data) {
    if (err || !data) { return next(err); }
    var users = JSON.parse(data);
    users.push({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      eMail: req.body.eMail
    });
    fs.writeFile(USERS, JSON.stringify(users), function(err) {
      if (err) { return next(err); }
      res.json({message: "User successfully added."});
    });
  });
});

// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(app.get('port'), function () {
  console.log('Connect to the server via http://localhost:' + app.get('port'));
});

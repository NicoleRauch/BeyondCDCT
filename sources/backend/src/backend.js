// This code is based on https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
//
// backend.js

// BASE SETUP
// =============================================================================

// load the packages we need
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const petstore = require('./petstore');

const app = express();                 // define our app using express
const USERS = path.join(__dirname, 'users.json');
const PETS = path.join(__dirname, 'pets.json');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 9090);        // set our port

// MIDDLEWARE for accessing the server from other servers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router

function readData(DATAFILE, next, callback) {
    petstore.allPets((err, data) => {
        if (err || !data) { return next(err); }

        callback(null, data);
    });
}

function writeData(DATAFILE, data, res, next, message) {

    fs.writeFile(DATAFILE, JSON.stringify(data), err => {
        if (err) { return next(err); }
        res.json({message: message});
    });
}

// test route to make sure everything is working (accessed at GET http://localhost:5555/api)
router.get('/', (req, res) => {
  res.json({message: 'hooray! welcome to our api!'});
});

router.get('/pets', (req, res, next) => {
    petstore.allPets((err, pets) => {
        if (err || !pets) { return next(err); }
        return res.json(pets);
    });
});

router.post('/pets', (req, res, next) => {
    petstore.savePet({ petName: req.body.petName, petPrice: req.body.petPrice, petType: req.body.petType }, err => {
       if(err) { return res.json({message: "Error when saving pet: " + err}); }
    });
    return res.json({message: "Pet successfully added."});
});

router.delete('/pets', (req, res, next) => {
    readData(PETS, next, (err, pets) => {
        writeData(PETS, pets /* TODO */, res, next, "Pet successfully deleted");
    });
});

// -------------------------------------

router.post('/user', (req, res, next) => {
  fs.readFile(USERS, (err, data) => {
    if (err || !data) { return next(err); }
    const users = JSON.parse(data);
    users.push({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      eMail: req.body.eMail
    });
    fs.writeFile(USERS, JSON.stringify(users), err => {
      if (err) { return next(err); }
      res.json({message: "User successfully added."});
    });
  });
});

// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(app.get('port'), () => {
  console.log('Connect to the server via http://localhost:' + app.get('port'));
});

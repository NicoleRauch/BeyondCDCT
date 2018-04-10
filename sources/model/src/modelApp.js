// This code is based on https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
//
// modelApp.js

// BASE SETUP
// =============================================================================

// load the packages we need
const express = require('express');
const bodyParser = require('body-parser');

const Model = require('./model');

let model = new Model();

const app = express();                 // define our app using express

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 8080);        // set our port

// MIDDLEWARE for accessing the server from other servers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router


router.get('/pets', (req, res) => {
    const pets = model.pets().getPets();
    res.json({tag: 'Pets', pets});
});

router.post('/pets', (req, res) => {
    const message = model.pets().addPet({ petName: req.body.petName, petPrice: req.body.petPrice, petType: req.body.petType });
    res.json({message});
});

router.delete('/pets', (req, res) => {
    const message = model.pets().removePet({ petName: req.body.petName, petPrice: req.body.petPrice, petType: req.body.petType });
    res.json({message});
});

// ===========================================================================

router.delete('/reset', (req, res) => {
    model = new Model();
    res.json({message: 'All pets successfully removed.'});
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
      res.json({message: 'User successfully added.'});
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

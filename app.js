const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const pe = require('parse-error');
const cors = require('cors');
const path = require('path');
var fs = require('fs');
const methodOverride = require('method-override');
const helmet = require('helmet');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const archive = require('./routes/archive');
const CONFIG = require('./config/config');
const models = require("./models/postgres");
var swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger/swagger.json');

const app = express(); // define our app using express
//Handles put requests

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , Authorization");
    next();
  })
  // override with the X-HTTP-Method-Override header in the request
  .use(methodOverride('X-HTTP-Method')) //          Microsoft
  .use(methodOverride('X-HTTP-Method-Override')) // Google/GData
  .use(methodOverride('X-Method-Override')) //      IBM
  .use(function (req, res, next) {
    // IE9 doesn't set headers for cross-domain ajax requests
    if (typeof (req.headers['content-type']) === 'undefined') {
      req.headers['content-type'] = "application/json; charset=UTF-8";
    }
    next();
  })
  // parse application/json
  //Handles post requests
  .use(bodyParser.json())
  // parse application/x-www-form-urlencoded
  .use(bodyParser.urlencoded({
    extended: false
  }))
  // parse various different custom JSON types as JSON
  .use(bodyParser.json({
    type: 'application/*+json'
  }))
  // parse some custom thing into a Buffer
  .use(bodyParser.raw({
    type: 'application/vnd.custom-type'
  }))

  // parse an HTML body into a string
  .use(bodyParser.text({
    type: 'text/html'
  }))
  .use('/archive', archive) //register the route
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  // allow cross origin requests
  // configure to only allow requests from certain origins
  .use(cors())
  .use(helmet({
    dnsPrefetchControl: false,
    frameguard: {
      action: 'sameorigin'
    },
    ieNoOpen: false,
  }));

//Log Env
console.log("Environment:", CONFIG.app);

if (CONFIG.app === 'dev') {
  models.sequelize.sync(); //creates table if they do not already exist
  // models.sequelize.sync({ force: true });//deletes all tables then recreates them useful for testing and development purposes
}
//Check whether log file exit or not
let logDirectory = path.join('./log/access.log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(logDirectory, {
  flags: 'a',
  interval: '1d' // rotate daily
});
// setup the logger by use "middleware"
app.use(morgan('combined', {
    stream: accessLogStream
  }))
  // log only 400 and 500 responses to console
  .use(morgan(CONFIG.app, {
    skip: function (req, res) {
      return res.statusCode < 400;
    }
  }));

app.get('*', function (req, res, next) {
  // IE9 doesn't set headers for cross-domain ajax requests
  res.setHeader('Content-Type', 'text/plain');
  res.status(404).end('Sorry, this is an invalid URL!');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
  next(err);
});
module.exports = app;

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
  console.error('Uncaught Error', pe(error));
});

process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception', pe(err));
});
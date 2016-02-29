// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express     = require('express');           // call express
var favicon     = require('serve-favicon'); 	// display the favicon
var app         = express();                    // define our app using express
var api		= express();			// define the api using express
var bodyParser  = require('body-parser');   	// body parsing (for POST calls)
var pg      = require('pg');        		// postgres database caller
var morgan  = require('morgan');        	// morgan (logger)
var fs      = require('fs');        		// filesystem access (for logging)
var url     = require('url');       		// Required for URL calls
var cors    = require('cors');      		// Required for CORS calls

// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// morgan logs
var accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log', {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}))

// favicon
app.use(favicon(__dirname + '/img/favicon.ico'));

// port definition
var port = process.env.PORT || 7164

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin");
    res.header("Access-Control-Allow-Methods","POST, GET, OPTIONS, DELETE, PUT, HEAD");
    res.header("Access-Control-Max-Age","1728000");
    res.header('Content-Type', 'application/json');
    next();
});

// REGISTER OUR ROUTES -------------------------------
api.use('/employees', require('./routes/employees'));
api.use('/regions', require('./routes/regions'));
api.use('/teams', require('./routes/teams'));
api.use('/assigners', require('./routes/assigners'));
api.use('/pr', require('./routes/pr'));
api.use('/backups/', require('./routes/backups'));
api.use('/resources/', require('./routes/resources'));
app.use('/api/v1', api);



module.exports = app;

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on http://172.17.121.14:' + port);

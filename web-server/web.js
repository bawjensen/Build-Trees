var argv        = require('optimist').argv,
    // bodyParser  = require('body-parser'),
    // cookieParser = require('cookie-parser'),
    express     = require('express'),
    fs          = require('fs'),
    logfmt      = require('logfmt'),
    // MongoClient = require('mongodb').MongoClient,
    path        = require('path'),
    promises     = require('../helpers/promised.js');
    // querystring = require('querystring'),
    // request     = require('request'),
    // session     = require('express-session');

// Global constants
// var MONGO_URL = process.env.MONGO_URL_PREFIX + argv.db_ip + process.env.MONGO_URL_DB;
// var MATCHES_PER_PAGE = 30;
// var DEFAULT_PRICE_CUTOFF = 700;

process.chdir(__dirname);

var app = express();

// Server is as set by env var, or by command-line argument, or defaults to port 5000
app.set('port', (process.env.PORT || argv.port || 5000));

// // Session stuff
// // app.use(session({
// //     secret: 'noonewilleverknow',
// //     resave: false,
// //     saveUninitialized: false
// // }));
// // app.use(cookieParser());

// Static serving files from specific folders
app.use('/favicon.ico', express.static(__dirname + '/img/favicon.png'));
app.use('/css',         express.static(__dirname + '/css'));
app.use('/js',          express.static(__dirname + '/js'));
app.use('/img',         express.static(__dirname + '/img'));
app.use('/data',        express.static(__dirname + '/data'));
// app.use('/bootstrap',   express.static(__dirname + '/bootstrap'));

// // Other stuff to use
app.use(logfmt.requestLogger());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// ================================= Helper functions =================================

// ================================= Routing functions ================================

var mainRouter = express.Router();

mainRouter.route('/')
    .get(function(req, res) {
        promises.readMultipleFiles([
                ['data/champBefore.json', 'champBefore']
            ])
            .then(function(filesObj) {
                res.render('index.jade',  {
                    champBefore: JSON.parse(filesObj['champBefore'])
                });
            })
            .catch(function(err) { res.status(500).send(500); });
    });

mainRouter.route('/:champName')
    .get(function(req, res) {
        promises.readMultipleFiles([
                ['data/itemBefore.json',    'itemBefore'],
                ['data/itemAfter.json',     'itemAfter'],
                ['data/champBefore.json',   'champBefore'],
                ['data/champAfter.json',    'champAfter'],
                ['data/' + req.params.champName + 'Before.json', 'dataBefore'],
                ['data/' + req.params.champName + 'After.json',  'dataAfter']
            ])
            .then(function(filesObj) {
                res.render('champ.jade', {
                    itemBefore:     filesObj['itemBefore'],
                    itemAfter:      filesObj['itemAfter'],
                    champBefore:    filesObj['champBefore'],
                    champAfter:     filesObj['champAfter'],
                    dataBefore:     filesObj['dataBefore'],
                    dataAfter:      filesObj['dataAfter']
                });
            })
            .catch(function(err) { res.status(500).send(500); });
    });


// Register the router
app.use('/', mainRouter);

// Start up the server
app.listen(app.get('port'), function() {
    console.log('Active on', app.get('port'));
});

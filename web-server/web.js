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
app.use('/riot.txt',    express.static(__dirname + '/riot.txt'));
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

app.route('*')
    .all(function(req, res, next) {
        promises.readMultipleFiles([
                ['data/champBefore.json', 'champBefore'],
                ['data/champAfter.json', 'champAfter'],
                ['data/champNameList.json', 'champNameList']
            ])
            .then(function(filesObj) {
                res.locals.champBefore = filesObj.champBefore;
                res.locals.champAfter = filesObj.champAfter;
                res.locals.champNameList = filesObj.champNameList;
                next();
            })
            .catch(function(err) { console.log(err.stack); res.sendStatus(500); });
    });

app.route('/')
    .get(function(req, res) {
        res.render('index.jade');
    });

app.route('/:champName')
    .get(function(req, res) {
        Promise.resolve()
            .then(function() {
                req.params.champName = req.params.champName.toLowerCase();
                if (!res.locals.champNameList[req.params.champName]) {
                    let err = new Error('Champ name url was invalid');
                    err.code = 'INVALID_CHAMP';
                    throw err;
                }
            })
            .catch(function(err) {
                if (err) {
                    res.render('invalidChamp.jade');
                }
                throw err;
            })
            .then(promises.readMultipleFiles.bind(null, [
                ['data/itemBefore.json',    'itemBefore'],
                ['data/itemAfter.json',     'itemAfter'],
                ['data/' + req.params.champName + 'Before.json', 'dataBefore'],
                ['data/' + req.params.champName + 'After.json',  'dataAfter']
            ]))
            .then(function(filesObj) {
                res.render('champ.jade', {
                    itemBefore:     filesObj['itemBefore'],
                    itemAfter:      filesObj['itemAfter'],
                    dataBefore:     filesObj['dataBefore'],
                    dataAfter:      filesObj['dataAfter']
                });
            })
            .catch(function(err) { console.log(err.stack); res.sendStatus(500); });
    });


// Start up the server
app.listen(app.get('port'), function() {
    console.log('Active on', app.get('port'));
});

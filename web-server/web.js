var argv        = require('optimist').argv,
    express     = require('express'),
    fs          = require('fs'),
    logfmt      = require('logfmt'),
    path        = require('path'),
    promises     = require('../helpers/promised.js');

// Set the directory to the directory of the file, so all requests are relative to the script
process.chdir(__dirname);

var app = express();

// Server is as set by env var, or by command-line argument, or defaults to port 5000
app.set('port', (process.env.PORT || argv.port || 5000));

// Static serving files from specific folders
app.use('/riot.txt',    express.static(__dirname + '/riot.txt'));
app.use('/favicon.ico', express.static(__dirname + '/img/favicon.png'));
app.use('/css',         express.static(__dirname + '/css'));
app.use('/js',          express.static(__dirname + '/js'));
app.use('/img',         express.static(__dirname + '/img'));
app.use('/data',        express.static(__dirname + '/data'));
// app.use('/bootstrap',   express.static(__dirname + '/bootstrap'));

// Other stuff to use
app.use(logfmt.requestLogger());

// ================================= Routing functions ================================

app.route('*')
    .all(function(req, res, next) {
        promises.readMultipleFiles([
                ['data/champBefore.json', 'champBefore'],
                // ['data/champAfter.json', 'champAfter'],
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
        req.params.champName = req.params.champName.toLowerCase();

        if (!res.locals.champNameList[req.params.champName]) {
            console.error('Champ name url was invalid:', req.params.champName);
            res.render('invalidChamp.jade');
        }
        else {
            res.render('champ.jade');
        }
    });


// Start up the server
app.listen(app.get('port'), function() {
    console.log('Active on', app.get('port'));
});

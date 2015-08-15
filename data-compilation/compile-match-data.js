var promises    = require('../helpers/promised.js'),
    querystring = require('querystring');

// --------------------------------------- Global Variables -------------------------------------

var NOW             = (new Date).getTime();
var WEEK_AGO        = NOW - 604800000; // One week in milliseconds

var API_KEY         = process.env.RIOT_KEY;
var DEFAULT_RATE_LIMIT = 100;
var RATE_LIMIT      = process.argv[2] ? parseInt(process.argv[2]) : DEFAULT_RATE_LIMIT;

var matchEndpoint       = 'https://na.api.pvp.net/api/lol/na/v2.2/match/';

var matchOptions = {
    'includeTimeline': 'true',
    'api_key': API_KEY
}

var matchQuery      = '?' + querystring.stringify(matchOptions);

// --------------------------------------- Helper Functions -------------------------------------

// --------------------------------------- Main Functions ---------------------------------------

function fetchAndStore() {
    var db;

    return promises.openDB('mongodb://localhost:27017/lol-data')
        .then(function(newDB) { db = newDB; })
        .then(promises.read.bind(null, 'json-data/matches/5.11/RANKED_SOLO/NA.json'))
        .then(JSON.parse)
        .then(function fetchEverything(matches) {
            return promises.rateLimitedGet(matches, RATE_LIMIT,
                function(matchId) {
                    return promises.persistentGet(matchEndpoint + matchId + matchQuery, matchId);
                },
                function(objectResult) {
                    var matchData = objectResult.data;
                    var matchId = objectResult.id;

                    matchData._id = matchId;

                    db.collection('matches').insert(matchData);
                });
        })
        .catch(console.error)
        .then(function() { db.close(); });
}

fetchAndStore();
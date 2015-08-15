var promises    = require('../helpers/promised.js'),
    querystring = require('querystring');

// --------------------------------------- Global Variables -------------------------------------

var API_KEY             = process.env.RIOT_KEY;
var DEFAULT_RATE_LIMIT  = 100;
var RATE_LIMIT          = DEFAULT_RATE_LIMIT;
var MATCH_LIMIT         = process.argv[2] ? parseInt(process.argv[2]) : 10000;
var MODE                = 'After';

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
    var desiredData = new Set([ 'timeline', 'participants' ]);
    var desiredTimelineData = new Set([ 'frames' ]);
    var desiredFrameData = new Set([ 'events' ]);
    var desiredParticipantData = new Set([ 'championId', 'participantId' ]);

    return promises.openDB('mongodb://localhost:27017/lol-data')
        .then(function(newDB) { db = newDB; })
        .then(promises.read.bind(null, 'json-data/matches/' + (MODE === 'After' ? '5.14' : '5.11') + '/RANKED_SOLO/NA.json'))
        .then(JSON.parse)
        .then(function fetchEverything(matches) {
            return promises.rateLimitedGet(matches.slice(0, MATCH_LIMIT), RATE_LIMIT,
                function(matchId) {
                    return promises.persistentGet(matchEndpoint + matchId + matchQuery);
                },
                function(matchData) {
                    matchData.timeline.frames = matchData.timeline.frames.filter(function(frame) {
                        if (!frame.events) return false;

                        for (var key in frame) {
                            if (!desiredFrameData.has(key))
                                delete frame[key];
                        }

                        frame.events = frame.events.filter(function(evt) {
                            return evt.eventType === 'ITEM_PURCHASED' || evt.eventType === 'ITEM_UNDO';
                        });
                        return frame.events.length !== 0;
                    });
                    for (var key in matchData.timeline) {
                        if (!desiredTimelineData.has(key))
                            delete matchData.timeline[key];
                    }

                    matchData.participants.forEach(function(participant) {
                        for (var key in participant) {
                            if (!desiredParticipantData.has(key))
                                delete participant[key];
                        }
                    });

                    for (var key in matchData) {
                        if (!desiredData.has(key)) {
                            delete matchData[key];
                        }
                    }

                    db.collection('matches' + MODE).insert(matchData);
                });
        })
        .catch(console.error)
        .then(function() { db.close(); });
}

fetchAndStore();

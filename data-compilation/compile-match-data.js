/*
Script file for compiling all of the match data into MongoDB, using the match ids supplied
as part of the challenge parameters.
*/

var promises    = require('../helpers/promised.js'), // Custom-built helper functions, promisifying many features
    querystring = require('querystring');

// --------------------------------------- Global Variables -------------------------------------

var API_KEY             = process.env.RIOT_CHALLENGE_KEY; // Note: API key is stored as environment variable, to properly secure it
var DEFAULT_RATE_LIMIT  = 250; // Limits the number of concurrent requests that can be sent to the API
var RATE_LIMIT          = DEFAULT_RATE_LIMIT; // Processor doesn't seem to be able to work any faster than this, so no benefit to raising
var MATCH_LIMIT         = process.argv[3] ? parseInt(process.argv[3]) : 10000; // Grab the number of matches to use from the command line, or 10000

var MODE = process.argv[2] ? // Grab the 'processing mode' from the command line
                (process.argv[2] === 'a' ? 'After' : 'Before') :
                'After';

console.log('In mode:', MODE);

// Breaking up the API url into its static/dynamic components
var endpointPrefix      = 'https://'
var apiUrl              = '.api.pvp.net/api/lol/'
var matchEndpoint       = '/v2.2/match/';

// Query options for getting match info
var matchOptions        = {
    'includeTimeline': 'true',
    'api_key': API_KEY
}

// Convert the object into a querystring
var matchQuery          = '?' + querystring.stringify(matchOptions);

// --------------------------------------- Helper Functions -------------------------------------

function logErrorAndRethrow(err) {
    console.error(err.stack);
    throw err;
}

function determineRole(timeline) {
    return timeline.lane === 'BOTTOM' ?
        (timeline.role === 'DUO_SUPPORT' ? 'SUPPORT' : 'ADC') :
        timeline.lane;
}

// --------------------------------------- Main Functions ---------------------------------------

function fetchAndStore() {
    var db; // Semi-global variable to hold mongodb reference

    // All the desired data to be kept. Everything else in response data is deleted before storing
    var desiredData = new Set([ 'timeline', 'participants' ]);
    var desiredTimelineData = new Set([ 'frames' ]);
    var desiredFrameData = new Set([ 'events' ]);
    var desiredParticipantData = new Set([ 'championId', 'participantId', 'winner', 'role' ]);

    // The two types of match data gathered
    var matchTypes = [
        'RANKED_SOLO',
        'NORMAL_5X5'
    ];
    // The regions of data given as part of the challenge
    var allRegions = [
        { filePrefix: 'BR', regionStr: 'br' },
        { filePrefix: 'EUNE', regionStr: 'eune' },
        { filePrefix: 'EUW', regionStr: 'euw' },
        { filePrefix: 'KR', regionStr: 'kr' },
        { filePrefix: 'LAN', regionStr: 'lan' },
        { filePrefix: 'LAS', regionStr: 'las' },
        { filePrefix: 'NA', regionStr: 'na' },
        { filePrefix: 'OCE', regionStr: 'oce' },
        { filePrefix: 'RU', regionStr: 'ru' },
        { filePrefix: 'TR', regionStr: 'tr' }
    ];

    // Holds all the urls for later API calls
    var allRegionUrls = [];

    // Read in all match ids from the different queue types and regions, and map them to the proper url for the API query
    return Promise.all(
        matchTypes.map(function(matchType) {
            return Promise.all(
                allRegions.map(function(regionObj) {
                    return promises.read('json-data/matches/' + (MODE === 'After' ? '5.14' : '5.11') + '/' + matchType + '/' + regionObj.filePrefix + '.json')
                        .catch(function(err) {
                            console.log(regionObj);
                            throw err;
                        })
                        .then(function(matches) {
                            let regionEndpoint = endpointPrefix + regionObj.regionStr + apiUrl + regionObj.regionStr + matchEndpoint;
                            return matches.slice(0, MATCH_LIMIT).map(function(matchId) { return regionEndpoint + matchId + matchQuery });
                        })
                        .then(function(regionUrls) {
                            return Array.prototype.push.apply(allRegionUrls, regionUrls); // Extends one array with the other
                        });
                    })
                );
            })
        )
        .then(function() { // Start making the API calls with the urls we just created
            return promises.openDB('mongodb://localhost:27017/lol-data')
                .then(function(newDB) { db = newDB; }) // Assign the db to the semi-global var, so it's available everywhere needed
                .then(function() { // Actually start making the API calls and handling the reponses
                    return promises.rateLimitedGet(allRegionUrls, RATE_LIMIT, // Makes calls to the API making use of the rate limit
                        function(apiUrl) { // Maps the url to an Promise making the 'GET' API request
                            return promises.persistentGet(apiUrl);
                        },
                        function(matchData) { // Handles the reponse data, namely trimming it down then storing it in MongoDB
                            // Parse out the teamIds and whether they won (useful for next step)
                            let isWinningTeam = {};
                            matchData.teams.forEach(function(team) {
                                isWinningTeam[team.teamId] = team.winner;
                            });

                            // Parse over match participants, trimming down data and assigning a flag for 'winner' based on teamId
                            matchData.participants.forEach(function(participant) {
                                participant.winner = isWinningTeam[participant.teamId];
                                participant.role = determineRole(participant.timeline);
                                for (var key in participant) {
                                    if (!desiredParticipantData.has(key))
                                        delete participant[key];
                                }
                            });

                            // Parse over timeline frames, trimming data down
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
                            // Trim timeline data itself
                            for (var key in matchData.timeline) {
                                if (!desiredTimelineData.has(key))
                                    delete matchData.timeline[key];
                            }

                            // Trim match data itself
                            for (var key in matchData) {
                                if (!desiredData.has(key)) {
                                    delete matchData[key];
                                }
                            }

                            // Finally store the information
                            db.collection('matches' + MODE).insert(matchData);
                        });
                });
        })
        .catch(logErrorAndRethrow)
        .then(function() { db.close(); });
}

// Start a timer, make the call, and end the timer when done.
var start = (new Date).getTime();
fetchAndStore()
    .then(function() {
        var end = (new Date).getTime();
        var minutes = (end - start) / 60000;
        console.log('Took', minutes, 'minutes');
        db.close();
    });

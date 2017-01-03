/*
Script file for compiling all of the match data into MongoDB, using the match ids supplied
as part of the challenge parameters.
*/

import _ from 'lodash';
import querystring from 'querystring';
import promises from './helpers/promises';

// --------------------------------------- Global Variables -------------------------------------

const API_KEY = process.env.RIOT_CHALLENGE_KEY;
// Limits the number of concurrent requests that can be sent to the API
const DEFAULT_RATE_LIMIT = 250;
// Processor doesn't seem to be able to work any faster than this, so no benefit to raising
const RATE_LIMIT = DEFAULT_RATE_LIMIT;
// Grab the number of matches to use from the command line, or 10000
const MATCH_LIMIT = process.argv[3] ? parseInt(process.argv[3], 10) : 10000;

// const PATCH = '6.24.1';

// Breaking up the API url into its static/dynamic components
const endpointPrefix = 'https://';
const API_URL = '.api.pvp.net/api/lol/';
const matchEndpoint = '/v2.2/match/';

// Query options for getting match info
const matchOptions = {
  includeTimeline: 'true',
  api_key: API_KEY,
};

// Convert the object into a querystring
const matchQuery = `?${querystring.stringify(matchOptions)}`;

// --------------------------------------- Helper Functions -------------------------------------

function logErrorAndRethrow(err) {
  console.error(err.stack); // eslint-disable-line no-console
  throw err;
}

function determineRole(timeline) {
  if (timeline.lane === 'BOTTOM') {
    return timeline.role === 'DUO_SUPPORT' ? 'SUPPORT' : 'ADC';
  }
  return timeline.lane;
}

// --------------------------------------- Main Functions ---------------------------------------

function fetchAndStore() {
  let db; // Semi-global variable to hold mongodb reference

  // The two types of match data gathered
  const matchTypes = [
    'RANKED_SOLO',
    'NORMAL_5X5',
  ];
  // The regions of data given as part of the challenge
  const allRegions = [
    { filePrefix: 'BR', regionStr: 'br' },
    { filePrefix: 'EUNE', regionStr: 'eune' },
    { filePrefix: 'EUW', regionStr: 'euw' },
    { filePrefix: 'KR', regionStr: 'kr' },
    { filePrefix: 'LAN', regionStr: 'lan' },
    { filePrefix: 'LAS', regionStr: 'las' },
    { filePrefix: 'NA', regionStr: 'na' },
    { filePrefix: 'OCE', regionStr: 'oce' },
    { filePrefix: 'RU', regionStr: 'ru' },
    { filePrefix: 'TR', regionStr: 'tr' },
  ];

  // Holds all the urls for later API calls
  const allRegionUrls = [];

  // Read in all match ids from the different queue types and regions, and map them to the proper
  // url for the API query
  return Promise.all(
    matchTypes.map(() =>
      Promise.all(
        allRegions.map((regionObj) =>
          promises.read('dummy/path/to/data.json')
          // return promises.read('json-data/matches/' + (MODE === 'After' ? '5.14' : '5.11') +...
          // ...'/' + matchType + '/' + regionObj.filePrefix + '.json')
            .catch((err) => {
              throw err;
            })
            .then((matches) => {
              const regionEndpoint = `${endpointPrefix}${regionObj.regionStr}${API_URL}${regionObj.regionStr}${matchEndpoint}`;
              return matches.slice(0, MATCH_LIMIT).map(
                (matchId) => `${regionEndpoint}${matchId}${matchQuery}`,
              );
            })
            .then((regionUrls) =>
              // Extends one array with the other
              Array.prototype.push.apply(allRegionUrls, regionUrls),
            ),
          ),
        ),
      ),
    )
    // Start making the API calls with the urls we just created
    .then(() =>
      promises.openDB('mongodb://localhost:27017/lol-data')
        // Assign the db to the semi-global const, so it's available everywhere needed
        .then((newDB) => { db = newDB; })
        // Actually start making the API calls and handling the reponses
        .then(() =>
          // Makes calls to the API making use of the rate limit
          promises.rateLimitedGet(allRegionUrls, RATE_LIMIT,
            // Maps the url to an Promise making the 'GET' API request
            (apiUrl) => promises.persistentGet(apiUrl),
            // Handles the reponse data, namely trimming it down then storing it in MongoDB
            (matchData) => {
              // Parse out the teamIds and whether they won (useful for next step)
              const isWinningTeam = {};
              matchData.teams.forEach((team) => {
                isWinningTeam[team.teamId] = team.winner;
              });

              const pickedMatchData = _.pick(matchData, ['timeline', 'participants']);

              // Parse over match participants, trimming down data and assigning a flag for
              // 'winner' based on teamId
              pickedMatchData.participants.forEach((participant) => {
                const newParticipant = _.pick(participant, ['championId', 'participantId']);

                newParticipant.winner = isWinningTeam[newParticipant.teamId];
                newParticipant.role = determineRole(newParticipant.timeline).toLowerCase();
              });

              // Parse over timeline frames, trimming data down
              pickedMatchData.timeline.frames = _(pickedMatchData.timeline.frames)
                .map((f) => {
                  const frame = _.pick(f, ['events']);

                  frame.events = _.filter(frame.events, (evt) =>
                    evt.eventType === 'ITEM_PURCHASED' || evt.eventType === 'ITEM_UNDO',
                  );

                  return frame;
                })
                .filter((frame) => !frame.events || frame.events.length !== 0)
                .value();

              pickedMatchData.timeline = _.pick(pickedMatchData.timeline, ['frames']);

              // Finally store the information
              db.collection('matches').insert(pickedMatchData);
            },
          ),
        ),
    )
    .catch(logErrorAndRethrow)
    .then(() => { db.close(); });
}

// Start a timer, make the call, and end the timer when done.
const start = (new Date()).getTime();
fetchAndStore()
  .then(() => {
    const end = (new Date()).getTime();
    const minutes = (end - start) / 60000;
    console.log('Took', minutes, 'minutes'); // eslint-disable-line no-console
  });

var fs          = require('fs'),
    promises    = require('../helpers/promised.js'), // Helper functions that 'promisify' useful behaviors
    Trie        = require('../helpers/item-build-trie.js'); // Custom data structure for storing builds

var LIMIT = process.argv[3] ? parseInt(process.argv[3]) : 10000; // Limiting the number of matches to use - useful for debugging

var MODE = process.argv[2] ? // Processing mode to use
                (process.argv[2] === 'a' ? 'After' : 'Before') :
                'After';

// Notify which mode is being used
console.log('In mode:', MODE);

// --------------------------------------- Helper Functions -------------------------------------

// Tests whether an item is a 'final build' item
function isFinalItem(itemId, staticItemData) {
    let itemData = staticItemData['' + itemId];
    // Tests if item builds into anything, makes sure it costs more than 500 gold, and that it's not boots (which are specifically removed)
    return ( (itemData.into.length === 0) && (itemData.gold.total > 500) && !(itemData.group && itemData.group.indexOf('Boots') !== -1) );
}

// Parses a timeline and returns an object of arrays that contain the 'final' bulids, in order of purchase
function extractItemBuilds(timeline, staticItemData) {
    if (!timeline) return;
    var allBuilds = {};

    timeline.frames.forEach(function(frame) {
        if (!frame.events) return;
        frame.events.forEach(function(evt) {
            if (evt.eventType === 'ITEM_PURCHASED' && isFinalItem(evt.itemId, staticItemData)) { // Include only 'final' items
                if (!(evt.participantId in allBuilds)) {
                    allBuilds[evt.participantId] = [];
                }

                allBuilds[evt.participantId].push(evt.itemId);
            }
            else if (evt.eventType === 'ITEM_UNDO' && evt.itemBefore && isFinalItem(evt.itemBefore, staticItemData)) { // Remove undone items
                var array = allBuilds[evt.participantId];
                let i = array.lastIndexOf(evt.itemBefore);
                array.splice(i, 1);
            }
        });
    });

    return allBuilds;
}

// --------------------------------------- Main Functions ---------------------------------------

function fetchAndStore() {
    var db; // Semi-global database variable
    var staticItemData; // Semi-global static item variable (read from file)
    var champNameConverter; // Semi-global champ name variable (read from file)

    var champItemBuilds = {};

    return promises.openDB('mongodb://localhost:27017/lol-data')
        .then(function(newDB) { db = newDB; }) // Store it for use anywhere
        .then(promises.read.bind(null, 'json-data/item' + MODE + '.json'))
        .then(function(itemData) { staticItemData = itemData.data; }) // Store it for use anywhere
        .then(promises.read.bind(null, 'json-data/champNameConverter' + MODE + '.json'))
        .then(function(nameConverter) { champNameConverter = nameConverter; }) // Store it for use anywhere
        .then(function() { // Read data from database, and insert into tries
            var counter = 0; // Counting how many entries have been handled
            return new Promise(function(resolve, reject) {
                var cursor = db.collection('matches' + MODE)
                    .find({}); // Database cursor to all matches in the processing mode

                cursor.count(function(err, count) { // Count the matches, in case it's less than limit
                    if (err)
                        throw err;

                    if (count > LIMIT) { // Limit only if count is above limit
                        cursor = cursor.limit(LIMIT);
                    }
                    else { // Adjust limit to be the max count
                        LIMIT = count;
                    }

                    cursor.forEach(function(match) { // Actually iterate the items from the db cursor
                        if (++counter >= LIMIT) {
                            resolve(); // Resolve the Promise when done
                        }

                        // The builds for all of the participants of this match
                        var allBuilds = extractItemBuilds(match.timeline, staticItemData);

                        match.participants.forEach(function(participant) {
                            if (!(participant.championId in champItemBuilds)) {
                                champItemBuilds[participant.championId] = new Trie();
                            }

                            let build = allBuilds[participant.participantId];

                            if (build) {
                                 // Only insert the first 6 items
                                champItemBuilds[participant.championId].insert(build.slice(0, 6), participant.winner);
                            }
                        });
                    });
                });
            });
        })
        .then(function() {
            console.log('Got', Object.keys(champItemBuilds).length, 'builds');

            for (var championId in champItemBuilds) {
                // Only keep the top 4 children of every node
                champItemBuilds[championId].prune(4);

                var champName = champNameConverter[''+championId].name;
                var jsonCompatibleTrie = champItemBuilds[championId].toTreeJSON(champName, staticItemData);

                jsonCompatibleTrie.champStrKey = champNameConverter[''+championId].strKey;

                // Output the serialized trie to a JSON file, for use by web-server/d3.js
                fs.writeFile('web-server/data/' + champName.toLowerCase() + MODE + '.json', JSON.stringify(jsonCompatibleTrie), function(err) { if (err) console.log(err); });
            }
        })
        .catch(function(err) {
            console.error(err.stack);
        })
        .then(function() {
            db.close();
        });
}

// Start a timer, make the call, and end the timer when done.
var start = (new Date).getTime();
fetchAndStore()
    .then(function() {
        var end = (new Date).getTime();
        var minutes = (end - start) / 60000;
        console.log('Took', minutes, 'minutes');
    });
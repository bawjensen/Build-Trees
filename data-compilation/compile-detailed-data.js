var fs          = require('fs'),
    promises    = require('../helpers/promised.js'),
    Trie        = require('../helpers/item-build-trie.js');

var LIMIT = process.argv[2] ? parseInt(process.argv[2]) : 10000;

var MODE = process.argv[3] ?
                (process.argv[3] === 'a' ? 'After' : 'Before') :
                'After';

console.log('In mode:', MODE);

// --------------------------------------- Global Variables -------------------------------------

// --------------------------------------- Helper Functions -------------------------------------

function isFinalItem(itemId, staticItemData) {
    let itemData = staticItemData['' + itemId];
    // console.log('Testing:', (!itemData.into.length), (itemData.gold.total > 500), itemData.name);
    return ( (itemData.into.length === 0) && (itemData.gold.total > 500) && !(itemData.group && itemData.group.indexOf('Boots') !== -1) );
}

function extractItemBuilds(timeline, staticItemData) {
    if (!timeline) return;
    var allBuilds = {};

    timeline.frames.forEach(function(frame) {
        if (!frame.events) return;
        frame.events.forEach(function(evt) {
            if (evt.eventType === 'ITEM_PURCHASED' && isFinalItem(evt.itemId, staticItemData)) {
                if (!(evt.participantId in allBuilds)) {
                    allBuilds[evt.participantId] = [];
                }

                allBuilds[evt.participantId].push(evt.itemId);
            }
            else if (evt.eventType === 'ITEM_UNDO' && evt.itemBefore && isFinalItem(evt.itemBefore, staticItemData)) {
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
    var db;
    var staticItemData;
    var champNameConverter;

    var champItemBuilds = {};

    return promises.openDB('mongodb://localhost:27017/lol-data')
        .then(function(newDB) { db = newDB; })
        .then(promises.read.bind(null, 'json-data/item' + MODE + '.json'))
        .then(function(itemData) { staticItemData = itemData.data; })
        .then(promises.read.bind(null, 'json-data/champNameConverter' + MODE + '.json'))
        .then(function(nameConverter) { champNameConverter = nameConverter; })
        .then(function() {
            var counter = 0;
            return new Promise(function(resolve, reject) {
                db.collection('matches' + MODE)
                    .find({})
                    .limit(LIMIT)
                    .forEach(function(match) {
                        if (++counter >= LIMIT) {
                            resolve();
                        }

                        var allBuilds = extractItemBuilds(match.timeline, staticItemData);

                        match.participants.forEach(function(participant) {
                            if (!(participant.championId in champItemBuilds)) {
                                champItemBuilds[participant.championId] = new Trie();
                            }

                            let build = allBuilds[participant.participantId];

                            if (build) {
                                champItemBuilds[participant.championId].insert(build.slice(0, 6));
                            }
                        });
                    });
                })
                .then(function() { return champItemBuilds; });
        })
        .then(function(champItemBuilds) {

            console.log('Got', Object.keys(champItemBuilds).length, 'builds');

            for (var championId in champItemBuilds) {
                // champItemBuilds[championId].bubblePartialBuilds();
                champItemBuilds[championId].prune(4);
    
                var champName = champNameConverter[''+championId].name;
                var jsonCompatibleTrie = champItemBuilds[championId].toTreeJSON(champName, staticItemData);

                jsonCompatibleTrie.champStrKey = champNameConverter[''+championId].strKey;

                fs.writeFile('web-server/data/' + champName.toLowerCase() + MODE + '.json', JSON.stringify(jsonCompatibleTrie), function(err) { if (err) console.log(err); });
            }
        })
        .catch(function(err) {
            console.error(err.stack);
        })
        .then(function() {
            var end = (new Date).getTime();
            var minutes = (end - start) / 60000;
            console.log('Took', minutes, 'minutes');
            db.close();
        });
}

var start = (new Date).getTime();
fetchAndStore();
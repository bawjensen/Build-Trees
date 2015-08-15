var fs          = require('fs'),
    promises    = require('../helpers/promised.js'),
    Trie        = require('../helpers/item-build-trie.js');

var LIMIT = process.argv[2] ? parseInt(process.argv[2]) : 10;

var MODE = 'After';

// --------------------------------------- Global Variables -------------------------------------

// --------------------------------------- Helper Functions -------------------------------------

function isFinalItem(itemId, staticItemData) {
    let itemData = staticItemData['' + itemId];
    // console.log('Testing:', (!itemData.into.length), (itemData.gold.total > 500), itemData.name);
    return (itemData.tags.indexOf('Boots') !== -1 || (itemData.group && itemData.group.indexOf('Boots') !== -1)) ?
        itemData.depth === 2 :
        (!itemData.into.length) && (itemData.gold.total > 500);
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
        .then(JSON.parse)
        .then(function(itemData) { staticItemData = itemData.data; })
        .then(promises.read.bind(null, 'json-data/champNameConverter' + MODE + '.json'))
        .then(JSON.parse)
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
                                // if (build.length > 6) console.log(build.map(function(itemId) { return staticItemData[itemId].name; }));
                                if (build.length > 6) build = build.slice(0,6);
                                // if (participant.championId === 429) {
                                //     console.log('\nInserting:', build.map(function(itemId) { return staticItemData[itemId].name; }));
                                // }
                                champItemBuilds[participant.championId].insert(build);
                            }
                        });
                    });
                })
                .then(function() { return champItemBuilds; });
        })
        .then(function(champItemBuilds) {

            for (var championId in champItemBuilds) {
                // console.log(champNameConverter[''+championId], '\n' + champItemBuilds[championId].toString(staticItemData));
                var champName = champNameConverter[''+championId];
                fs.writeFile('web-server/data/' + champName + '.json', champItemBuilds[championId].toJSON(champName, staticItemData), function(err) { if (err) console.log(err); });
                // console.log(champNameConverter['429'], '\n' + champItemBuilds[429].toString(staticItemData));
            }
        })
        // .then(console.log)
        .catch(function(err) {
            console.error(err.stack);
        })
        .then(function() { db.close(); });
}

fetchAndStore();
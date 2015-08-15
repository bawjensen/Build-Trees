var promises    = require('../helpers/promised.js'),
    Trie        = require('../helpers/item-build-trie.js');

var LIMIT = 50;

// --------------------------------------- Global Variables -------------------------------------

// --------------------------------------- Helper Functions -------------------------------------

function isFinalItem(itemId, staticItemData) {
    let itemData = staticItemData['' + itemId];
    // console.log('Testing:', (!itemData.into.length), (itemData.gold.total > 500), itemData.name);
    return (!itemData.into.length) && (itemData.gold.total > 500);
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
    var staticChampData;

    var champItemBuilds = {};

    return promises.openDB('mongodb://localhost:27017/lol-data')
        .then(function(newDB) { db = newDB; })
        .then(promises.read.bind(null, 'json-data/item.json'))
        .then(JSON.parse)
        .then(function(itemData) { staticItemData = itemData.data; })
        .then(promises.read.bind(null, 'json-data/champion.json'))
        .then(JSON.parse)
        .then(function(champData) { staticChampData = champData.data; })
        .then(function() {
            var counter = 0;
            return new Promise(function(resolve, reject) {
                db.collection('matches')
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

                            if (allBuilds[participant.participantId])
                                champItemBuilds[participant.championId].insert(allBuilds[participant.participantId]);
                        });
                    });
                })
                .then(function() { return champItemBuilds; });
        })
        .then(function(champItemBuilds) {
            for (var championId in champItemBuilds) {
                console.log('championId:', championId, '\n' + champItemBuilds[championId].toString(staticItemData));
            }
        })
        // .then(console.log)
        .catch(console.error)
        .then(function() { db.close(); });
}

fetchAndStore();
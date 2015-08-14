var promises    = require('../helpers/promised.js');

// --------------------------------------- Global Variables -------------------------------------

// --------------------------------------- Helper Functions -------------------------------------

// --------------------------------------- Main Functions ---------------------------------------

function fetchAndStore() {
    var db;

    return promises.openDB('mongodb://localhost:27017/lol-data')
        .then(function(newDB) { db = newDB; })
        .then(function() {
            db.collection('matches')
                .find({})
                // .limit(10)
                .toArray(function(err, matches) {
                    if (err)
                        console.error(err);
                    else
                        console.log('matches', matches);
                });
        })
        .catch(console.error)
        .then(function() { db.close(); });
}

fetchAndStore();
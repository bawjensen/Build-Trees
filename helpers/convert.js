/* 
This script file is for converting the static data gathered from riot into a format
a little more compact, containing only useful information. Does multiple 'parallel'
conversions, each of which is invoked at the bottom of the script.
*/

var fs = require('fs'),
    promises = require('./promised.js');

// Processing mode, for 5.11 or 5.14 data
var MODE = process.argv[2] ?
                (process.argv[2] === 'a' ?
                    'After' :
                    'Before') :
                'After';

console.log('Converting in mode:', MODE);

// Creates an object responsible for converting the integer id of a champion into an object
// containing their string id and name
function createNameConverter() {
    fs.readFile('json-data/champion' + MODE + '.json', function(err, buffer) {
        var data = JSON.parse(buffer);
        var newData = {};

        for (var strKey in data.data) {
            newData[parseInt(data.data[strKey].key)] = { name: data.data[strKey].name, strKey: strKey };
        }

        fs.writeFile('json-data/champNameConverter' + MODE + '.json', JSON.stringify(newData));
    });
}

// Creates an object for converting the lowercase version of a champion's name into their
// cannonical name
// Note: This function ignores MODE, always uses 'Before' list
function createNameList() {
    promises.read('json-data/championBefore.json')
        .then(function(data) {
            data = data.data;
            var newData = {};

            for (var strKey in data) {
                newData[data[strKey].name.toLowerCase()] = data[strKey].name;
            }

            fs.writeFile('json-data/champNameList.json', JSON.stringify(newData));
        })
        .catch(function(err) { console.error('Err:', err.stack); throw err; });
}

createNameConverter();
createNameList();
var fs = require('fs'),
    promises = require('./promised.js');

var MODE = process.argv[2] ?
                (process.argv[2] === 'a' ?
                    'After' :
                    'Before') :
                'After';

console.log('Converting in mode:', MODE);

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

// Note: This function ignores MODE, always uses 'Before' list
function createNameList() {
    promises.read('json-data/championBefore.json')
        .then(function(data) {
            data = data.data;
            var newData = {};

            for (var strKey in data) {
                newData[data[strKey].name.toLowerCase()] = 1;
            }

            fs.writeFile('json-data/champNameList.json', JSON.stringify(newData));
        })
        .catch(function(err) { console.error('Err:', err.stack); throw err; });
}

createNameConverter();
createNameList();
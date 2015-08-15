var fs = require('fs');

var MODE = 'Before';

fs.readFile('json-data/champion' + MODE + '.json', function(err, buffer) {
    var data = JSON.parse(buffer);
    var newData = {};

    for (var strKey in data.data) {
        newData[parseInt(data.data[strKey].key)] = data.data[strKey].name;
    }

    fs.writeFile('json-data/champNameConverter' + MODE + '.json', JSON.stringify(newData));
});
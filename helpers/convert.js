var fs = require('fs');

fs.readFile('json-data/champion.json', function(err, buffer) {
    var data = JSON.parse(buffer);
    var newData = {};

    for (var strKey in data.data) {
        newData[parseInt(data.data[strKey].key)] = data.data[strKey].name;
    }

    fs.writeFile('json-data/champNameConverter.json', JSON.stringify(newData));
});
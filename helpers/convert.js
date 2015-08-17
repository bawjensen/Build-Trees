var fs = require('fs');

var MODE = process.argv[2] ?
                (process.argv[2] === 'a' ?
                    'After' :
                    'Before') :
                'After';

console.log('Converting in mode:', MODE);

fs.readFile('json-data/champion' + MODE + '.json', function(err, buffer) {
    var data = JSON.parse(buffer);
    var newData = {};

    for (var strKey in data.data) {
        newData[parseInt(data.data[strKey].key)] = { name: data.data[strKey].name, strKey: strKey };
    }

    fs.writeFile('json-data/champNameConverter' + MODE + '.json', JSON.stringify(newData));
});
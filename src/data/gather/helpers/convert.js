/*
This script file is for converting the static data gathered from riot into a format
a little more compact, containing only useful information. Does multiple 'parallel'
conversions, each of which is invoked at the bottom of the script.
*/

import _ from 'lodash';
import fs from 'fs';
import promises from './promises.js';

// Creates an object responsible for converting the integer id of a champion into an object
// containing their string id and name
function createNameConverter() {
  fs.readFile('json-data/champion-dummy.json', (err, buffer) => {
    const data = JSON.parse(buffer);
    const newData = {};

    _.forEach(data.data, (strKey) => {
      newData[parseInt(data.data[strKey].key, 10)] = { name: data.data[strKey].name, strKey };
    });

    fs.writeFile('json-data/champNameConverter-dummy.json', JSON.stringify(newData));
  });
}

// Creates an object for converting the lowercase version of a champion's name into their
// cannonical name
// Note: This function ignores MODE, always uses 'Before' list
function createNameList() {
  promises.read('json-data/champion-dummy.json')
    .then((d) => {
      const data = d.data;
      const newData = {};

      _.forEach(data, (strKey) => {
        newData[data[strKey].name.toLowerCase()] = data[strKey].name;
      });

      fs.writeFile('json-data/champNameList.json', JSON.stringify(newData));
    })
    .catch((err) => { console.error('Err:', err.stack); throw err; }); // eslint-disable-line no-console
}

createNameConverter();
createNameList();

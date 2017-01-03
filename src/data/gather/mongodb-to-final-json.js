/*
Script file for taking all of the data stored temporarily in MongoDB, and converting
it to its final, more immediately usable form in JSON.
*/

import _ from 'lodash';
import fs from 'fs';
import promises from './helpers/promises.js';
import Trie from './helpers/item-build-trie.js';

// Limiting the number of matches to use - useful for debugging
const LIMIT = process.argv[3] ? parseInt(process.argv[3], 10) : 200000;

const MODE = process.argv[2] === 'b' ? 'Before' : 'After';

// --------------------------------------- Helper Functions -------------------------------------

// Tests whether an item is a 'final build' item
function isFinalItem(itemId, staticItemData) {
  const itemData = staticItemData[`${itemId}`];
  // Tests if item builds into anything, makes sure it costs more than 500 gold, and that it's
  // not boots (which are specifically removed)
  return (
    (itemData.into.length === 0) && (itemData.gold.total > 500)
      && !(itemData.group && itemData.group.indexOf('Boots') !== -1)
  );
}

// Parses a timeline and returns an object of arrays that contain the 'final' bulids,
// in order of purchase
function extractItemBuilds(timeline, staticItemData) {
  if (!timeline) return null;

  const allBuilds = {};

  timeline.frames.forEach((frame) => {
    if (!frame.events) return;
    frame.events.forEach((evt) => {
      // Include only 'final' items
      if (evt.eventType === 'ITEM_PURCHASED' && isFinalItem(evt.itemId, staticItemData)) {
        if (!(evt.participantId in allBuilds)) {
          allBuilds[evt.participantId] = [];
        }

        allBuilds[evt.participantId].push(evt.itemId);
      } else if (evt.eventType === 'ITEM_UNDO'
          && evt.itemBefore && isFinalItem(evt.itemBefore, staticItemData)) { // Remove undone items
        const array = allBuilds[evt.participantId];
        array.splice(array.lastIndexOf(evt.itemBefore), 1);
      }
    });
  });

  return allBuilds;
}

// --------------------------------------- Main Functions ---------------------------------------

function main() {
  let db; // Semi-global database variable
  let staticItemData; // Semi-global static item variable (read from file)
  let champNameConverter; // Semi-global champ name variable (read from file)

  let limit = LIMIT;

  const champItemBuilds = {};
  const champItemRoleBuilds = {};

  return promises.openDB('mongodb://localhost:27017/lol-data')
    .then((newDB) => { db = newDB; }) // Store it for use anywhere
    .then(promises.read.bind(null, `json-data/item${MODE}.json'`))
    .then((itemData) => { staticItemData = itemData.data; }) // Store it for use anywhere
    .then(promises.read.bind(null, `json-data/champNameConverter${MODE}.json'`))
    .then((nameConverter) => { champNameConverter = nameConverter; }) // Store it for use anywhere
    .then(() => { // Read data from database, and insert into tries
      let counter = 0; // Counting how many entries have been handled

      return new Promise((resolve) => {
        let cursor = db.collection(`matches${MODE}`)
          .find({}); // Database cursor to all matches in the processing mode

        cursor.count((err, count) => { // Count the matches, in case it's less than limit
          if (err) throw err;

          if (count > limit) { // Limit only if count is above limit
            cursor = cursor.limit(limit);
          } else { // Adjust limit to be the max count
            limit = count;
          }

          cursor.forEach((match) => { // Actually iterate the items from the db cursor
            counter += 1;

            if (counter >= limit) {
              resolve(); // Resolve the Promise when done
            }

            // The builds for all of the participants of this match
            const allBuilds = extractItemBuilds(match.timeline, staticItemData);

            match.participants.forEach((participant) => {
              if (!(participant.championId in champItemBuilds)) {
                champItemRoleBuilds[participant.championId] = {};
                champItemBuilds[participant.championId] = new Trie();
              }

              if (!(participant.role in champItemRoleBuilds[participant.championId])) {
                champItemRoleBuilds[participant.championId][participant.role] = new Trie();
              }

              const build = allBuilds[participant.participantId];

              if (build) {
                // Only insert the first 6 items
                champItemBuilds[participant.championId].insert(
                  build.slice(0, 6), participant.winner,
                );
                champItemRoleBuilds[participant.championId][participant.role].insert(
                  build.slice(0, 6), participant.winner,
                );
              }
            });
          });
        });
      });
    })
    .then(() => {
      console.log('Got', Object.keys(champItemBuilds).length, 'builds'); // eslint-disable-line no-console

      _.forEach(Object.keys(champItemBuilds), (championId) => {
        // Only keep the top 4 children of every node
        champItemBuilds[championId].prune(4);

        const champName = champNameConverter[`${championId}`].name;
        const jsonCompatibleTrie = champItemBuilds[championId].toTreeJSON(
          champName,
          staticItemData,
        );

        jsonCompatibleTrie.champStrKey = champNameConverter[`${championId}`].strKey;

        // Output the serialized trie to a JSON file, for use by web-server/d3.js
        fs.writeFile(
          `web-server/data/${champName.toLowerCase()}${MODE}.json`,
          JSON.stringify(jsonCompatibleTrie),
          (err) => { if (err) console.log(err); }, // eslint-disable-line no-console
        );
      });

      _.forEach(champItemRoleBuilds, (championObj, championId) => {
        const champName = champNameConverter[`${championId}`].name;

        _.forEach(championObj, (role) => {
          // Only keep the top 4 children of every node
          champItemRoleBuilds[championId][role].prune(4);

          const jsonCompatibleTrie = champItemRoleBuilds[championId][role].toTreeJSON(
            champName,
            staticItemData,
          );

          jsonCompatibleTrie.champStrKey = champNameConverter[`${championId}`].strKey;

          // Output the serialized trie to a JSON file, for use by web-server/d3.js
          fs.writeFile(
            `web-server/data/${champName.toLowerCase()}${role}${MODE}.json`,
            JSON.stringify(jsonCompatibleTrie),
            (err) => { if (err) console.log(err); }, // eslint-disable-line no-console
          );
        });
      });
    })
    .catch((err) => {
      console.error(err.stack); // eslint-disable-line no-console
    })
    .then(() => {
      db.close();
    });
}


const start = (new Date()).getTime();
main()
  .then(() => {
    const end = (new Date()).getTime();
    const minutes = (end - start) / 60000;
    console.log('Took', minutes, 'minutes'); // eslint-disable-line no-console
  });

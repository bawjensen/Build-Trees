/*
Script file to promisify various useful functions.
*/

import _ from 'lodash';
import fs from 'fs';
import { MongoClient } from 'mongodb';
import request from 'request';

// --------------------------------------- Helpers ---------------------------------------

// Logs the error before rethrowing - not for catching errors, but for seeing them
function logErrorAndRethrow(err) {
  console.error(err.stack); // eslint-disable-line no-console
  throw err;
}

// Dummy function to stand in for default behavior
function rethrowError(err) {
  throw err;
}

// --------------------------------------- Main Functions --------------------------------

// Opens a database
function openDB(url) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if (err) reject(Error(err));
      else resolve(db);
    });
  });
}

// Reads JSON data from a file
function read(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) reject(Error(err));
      else resolve(JSON.parse(data));
    });
  });
}

// Reads JSON data from multiple files
// Note, doesn't error on file missing, rather returns null
function readMultipleFiles(iterable) {
  const filesObj = {};

  return Promise.all(
      iterable.map((tuple) =>
        read(tuple[0])
          .catch(_.noop)
          .then((jsonData) => { filesObj[tuple[1]] = jsonData; }),
      ),
    )
    .then(() => filesObj);
}

// Returns the response for the provided URL
function get(url) {
  return new Promise((resolve, reject) => {
    request.get(url, (err, resp, body) => {
      if (err) reject(Error(err));
      else resolve(body);
    });
  });
}

// Persistent handler for the response of a get request on the given url. If the response code
// corresponds to specific HTTP codes, it will try again or terminate as appropriate.
function persistentCallback(url, identifier, resolve, reject, err, resp, body) {
  if (err) {
    reject(err);
  } else if (resp.statusCode === 429) {
    setTimeout(() => {
      request.get(url, persistentCallback.bind(null, url, identifier, resolve, reject));
    }, parseInt(resp.headers['retry-after'] || '1000', 10));
  } else if (resp.statusCode === 503 || resp.statusCode === 500 || resp.statusCode === 504) {
    setTimeout(() => {
      request.get(url, persistentCallback.bind(null, url, identifier, resolve, reject));
    }, 500);
  } else if (resp.statusCode === 404) {
    const error = new Error(`Resp code was 404: ${url}`);
    error.http_code = 404;
    error.identifier = identifier;
    reject(error);
  } else if (resp.statusCode !== 200) { // Catch all for other codes that aren't specified or 200-OK
    reject(new Error(`Resp status code not 200: ${resp.statusCode} (${url})`));
  } else {
    resolve(body);
  }
}

// Persistently tries to get the desired response from the given url, possibly with a
// provided identifier
function persistentGet(url, identifier) {
  return new Promise(
    (resolve, reject) => {
      request.get(url, persistentCallback.bind(null, url, identifier, resolve, reject));
    })
    .catch((err) => {
      if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') { // If typical errors
        console.error('\rIssue with:', url, '\n', err); // eslint-disable-line no-console

        return new Promise((resolve, reject) => {
          request.get(url, persistentCallback.bind(null, url, identifier, resolve, reject));
        });
      }

      throw err;
    })
    .then(JSON.parse)
    .catch((err) => {
      if (err instanceof SyntaxError) {
        console.log('\rIgnoring:', url, err); // eslint-disable-line no-console
      } else {
        throw err;
      }
    })
    .then((data) => {
      if (identifier) return { data, id: identifier };

      return data;
    })
    .catch(logErrorAndRethrow);
}

// Function to maintain a set number of active requests
function rateLimitedGet(iterable, limitSize, promiseMapper, resultHandler, errorHandler) {
  return new Promise((resolve) => {
    const isSet = (iterable instanceof Set);
    const isArray = !isSet;

    const numTotal = isArray ? iterable.length : iterable.size;
    let numActive = 1;      // Manually adjust for initial run
    let numReceived = -1;   // Manually adjust for initial run
    const iter = iterable[Symbol.iterator]();
    let elem = iter.next();

    // Callback to handle responses, and send requests
    const handleResponseAndSendNext = () => {
      numActive -= 1;
      numReceived += 1;

      // Write without a newline, and overwrite the existing output on this line
      // (creates a nice progress message)
      process.stdout.write(`\rReached ${numReceived} / ${numTotal} requests`);

      if (numReceived >= numTotal) {
        process.stdout.write('\n');
        resolve();
      } else {
        while (numActive < limitSize && !elem.done) {
          promiseMapper(elem.value)
            .catch(errorHandler || rethrowError)
            .then(resultHandler)
            .then(handleResponseAndSendNext)
            .catch(logErrorAndRethrow);
          numActive += 1;
          elem = iter.next();
        }
      }
    };

    // Initial call
    handleResponseAndSendNext();
  })
    .catch(logErrorAndRethrow);
}

module.exports = {
  get,
  openDB,
  persistentGet,
  rateLimitedGet,
  read,
  readMultipleFiles,
};

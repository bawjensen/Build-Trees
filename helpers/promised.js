/*
Script file to promisify various useful functions.
*/

var fs          = require('fs'),
    MongoClient = require('mongodb').MongoClient,
    request     = require('request');

// --------------------------------------- Helpers ---------------------------------------

// Logs the error before rethrowing - not for catching errors, but for seeing them
function logErrorAndRethrow(err) {
    console.error(err.stack);
    throw err;
}

// Dummy function to stand in for default behavior
function rethrowError(err) {
    throw err;
}

// --------------------------------------- Main Functions --------------------------------

// Opens a database
function openDB(url) {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(url, function(err, db) {
            if (err)
                reject(Error(err));
            else
                resolve(db);
        });
    });
}

// Reads JSON data from a file
function read(filepath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filepath, 'utf8', function(err, data) {
            if (err)
                reject(Error(err));
            else
                resolve(JSON.parse(data));
        });
    });
}

// Reads JSON data from multiple files
// Note, doesn't error on file missing, rather returns null
function readMultipleFiles(iterable) {
    var filesObj = {};
    return Promise.all(
            iterable.map(function(tuple) {
                return read(tuple[0]).catch(function(err) { return null; }).then(function(jsonData) { filesObj[tuple[1]] = jsonData; });
            })
        )
        .then(function() {
            return filesObj;
        });
}

// Returns the response for the provided URL
function get(url) {
    return new Promise(function(resolve, reject) {
        request.get(url, function(err, resp, body) {
            if (err)
                reject(Error(err));
            else
                resolve(body);
        });
    });
}

// Persistent handler for the response of a get request on the given url. If the response code
// corresponds to specific HTTP codes, it will try again or terminate as appropriate. 
function persistentCallback(url, identifier, resolve, reject, err, resp, body) {
    if (err) {
        reject(err);
    }
    else if (resp.statusCode === 429) { // 429 is rate limited, try again in the specified time or 1 second
        setTimeout(function() {
            request.get(url, persistentCallback.bind(null, url, identifier, resolve, reject));
        }, parseInt(resp.headers['retry-after'] || '1000'));
    }
    else if (resp.statusCode === 503 || resp.statusCode === 500 || resp.statusCode === 504) { // Various (temporary) error codes, try again in 0.5 sec
        setTimeout(function() {
            request.get(url, persistentCallback.bind(null, url, identifier, resolve, reject));
        }, 500);
    }
    else if (resp.statusCode === 404) { // Error with url most likely, create a new error object and send it
        let error = new Error('Resp code was 404: ' + url);
        error.http_code = 404;
        error.identifier = identifier;
        reject(error);
    }
    else if (resp.statusCode !== 200) { // Catch all for other codes that aren't specified or 200-OK
        reject(Error('Resp status code not 200: ' + resp.statusCode + '(' + url + ')'));
    }
    else {
        resolve(body);
    }
}
// Persistently tries to get the desired response from the given url, possibly with a provided identifier
function persistentGet(url, identifier) {
    return new Promise(function get(resolve, reject) {
            request.get(url, persistentCallback.bind(null, url, identifier, resolve, reject)); // Perform the 'GET'
        })
        .catch(function catchResetOrTimeOut(err) {
            if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') { // If typical errors
                console.error('\rIssue with:', url, '\n', err);
                return new Promise(function get(resolve, reject) { // Try again
                    request.get(url, persistentCallback.bind(null, url, identifier, resolve, reject));
                });
            }
            else {
                throw err;
            }
        })
        .then(JSON.parse)
        .catch(function catchEndOfInputError(err) {
            if (err instanceof SyntaxError) {
                console.log('\rIgnoring:', url, err);
            }
            else {
                throw err;
            }
        })
        .then(function returnWithIdentifier(data) {
            return data ? // Return data+identifier, data or null
                        (identifier ?
                            { data: data, id: identifier } :
                            data)
                        : null;
        })
        .catch(logErrorAndRethrow);
}

// Function to maintain a set number of active requests
function rateLimitedGet(iterable, limitSize, promiseMapper, resultHandler, errorHandler) {
    return new Promise(function(resolve, reject) {
        var isSet = (iterable instanceof Set) ? true : false;
        var isArray = !isSet;

        var numTotal = isArray ? iterable.length : iterable.size;
        var reportIncrement = Math.max(Math.round(numTotal / 100), 1);
        var numActive = 1;      // Manually adjust for initial run
        var numReceived = -1;   // Manually adjust for initial run
        var iter = iterable[Symbol.iterator]();
        var elem = iter.next();

        // Callback to handle responses, and send requests
        var handleResponseAndSendNext = function() {
            --numActive;
            ++numReceived;

            // Write without a newline, and overwrite the existing output on this line (creates a nice progress message)
            process.stdout.write('\rReached ' + numReceived + ' / ' + numTotal + ' requests');

            if (numReceived >= numTotal) {
                process.stdout.write('\n');
                resolve();
            }
            else {
                while (numActive < limitSize && !elem.done) {
                    promiseMapper(elem.value)
                        .catch(errorHandler ? errorHandler : rethrowError)
                        .then(resultHandler)
                        .then(handleResponseAndSendNext)
                        .catch(logErrorAndRethrow);
                    ++numActive;
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
    get:            get,
    openDB:         openDB,
    persistentGet:  persistentGet,
    rateLimitedGet: rateLimitedGet,
    read:           read,
    readMultipleFiles: readMultipleFiles
};
/*
Script file for a new data structure optimized for holding the builds of a champion
along with how many times the specific items were bought.
*/

// Global variables
var BUILD_PERCENT_THRESHOLD = 0.075; // Percentage threshold for not pruning a given build, when using percentage pruning
var WIN_RATE_DECIMAL_NUMBERS = 2; // Number of decimal places to truncate win rate percentage

// Class for a Trie Node, containing various cargo data values
function Node() {
    this.count = 0; // Number of times item build was purchased
    this.endedHere = 0; // Number of builds in which this was the final item
    this.buildWon = 0; // Number of builds that won with this item
    this.buildLost = 0; // Number of builds that lost with this item
    this.children = {}; // Children Nodes object, not array, for quicker access of specific children
}

// Class for the Trie data structure
function Trie() {
    this.head = new Node(); // Create the head as an empty node, because it is unique in the trie
}

// Insert an item build (as an array of item ids) into the trie, updating values as necessary
// 'winner' flag is used to update buildWon and buildLost
Trie.prototype.insert = function(item_build, winner) {
    var node = this.head;
    ++node.count; // Always increment the head, as it signifies the number of times this champ was played
    winner ? ++node.buildWon : ++node.buildLost; // Increment the __champ's__ winrate

    // Simple depth-first iteration through a tree, iterative style
    for (let item of item_build) {
        if (!(item in node.children)) {
            node.children[item] = new Node();
        }

        node = node.children[item]; // Set node to child
        ++node.count; // Counts whenever an item was even a part of a build
        winner ? ++node.buildWon : ++node.buildLost; // Increment win/loss
    }

    ++node.endedHere; // Increment the ending point of the build
};

// Function to recursively 'normalize' the count value of a Trie, by scaling
// up all children values until their sum matches the parent's count
function recursiveNormalize(node) {
    var shortedRatio;
    if (Object.keys(node.children).length !== 0) {
        let childrenSum = Object.keys(node.children).reduce(function(sumSoFar, childKey) { return sumSoFar + node.children[childKey].count; }, 0);
        shortedRatio =  node.count / childrenSum;
    }

    for (var key in node.children) {
        node.children[key].count = Math.round(node.children[key].count * shortedRatio);
        recursiveNormalize(node.children[key]); // Important that recursion happens after up-scaling
    }
}
// Normalizes the trie to remove effects of item builds terminating early and
// leaving the lower portions of trie with very small counts
Trie.prototype.normalizePartialBuilds = function() {
    recursiveNormalize(this.head);
}

// Comparison function for sorting an array of arrays high to low
function comp(a, b) {
    return b[0] - a[0];
}
// Recursively prunes the trie down to a given number of children per node,
// only keeping the highest count ones
function recursivePrune(node, numToKeep) {
    if (Object.keys(node.children).length === 0) return;

    let sortable = [];
    for (let key in node.children) {
        sortable.push([node.children[key].count, key]);
    }
    sortable.sort(comp);

    for (let i = 0; i < numToKeep && i < sortable.length; ++i) {
        if (node.children[ sortable[i][1] ].count >= 3) {
            recursivePrune( node.children[ sortable[i][1] ], numToKeep );
        }
    }
    for (let i = numToKeep; i < sortable.length; ++i) {
        delete node.children[ sortable[i][1] ];
    }
}
// Prunes the trie down to a certain number of children per node, keeping largest children
Trie.prototype.prune = function(numToKeep) {
    recursivePrune(this.head, numToKeep);
    this.normalizePartialBuilds();
}

// Recursively converts the Trie data struture into a serializable object for the JSON format,
// storing only useful data and performing minimal pre-processing
function recursiveToTreeJSON(node, tree, staticItemData) {
    for (var key in node.children) {
        tree.children.push({
            name: staticItemData[key].name,
            itemId: key,
            count: node.children[key].count,
            winRate: parseFloat( (node.children[key].buildWon / (node.children[key].buildWon + node.children[key].buildLost)).toFixed(WIN_RATE_DECIMAL_NUMBERS + 2) ),
            children: []
        });
        recursiveToTreeJSON(node.children[key], tree.children[tree.children.length-1], staticItemData);
    }
}
// Converts the Trie data struture into a serializable object for the JSON format in the format expected
// by D3.js' tree structure, storing only useful data and performing minimal pre-processing
Trie.prototype.toTreeJSON = function(champName, staticItemData) {
    var tree = {
        name: champName,
        count: this.head.count,
        winRate: parseFloat( (this.head.buildWon / (this.head.buildWon + this.head.buildLost)).toFixed(WIN_RATE_DECIMAL_NUMBERS + 2) ),
        children: []
    };

    recursiveToTreeJSON(this.head, tree, staticItemData);

    return tree;
}

module.exports = Trie;
/*
Script file for a new data structure optimized for holding the builds of a champion
along with how many times the specific items were bought.
*/

import _ from 'lodash';

// Global variables
// Number of decimal places to truncate win rate percentage
const WIN_RATE_DECIMAL_NUMBERS = 2;

class Node {
  constructor() {
    this.count = 0;
    this.endedHere = 0;
    this.buildWon = 0;
    this.buildLost = 0;
    this.children = {};
  }
}

// Comparison function for sorting an array of arrays high to low
function comp(a, b) {
  return b[0] - a[0];
}

class Trie {
  constructor() {
    this.head = new Node();
  }

  // Insert an item build (as an array of item ids) into the trie, updating values as necessary
  // 'winner' flag is used to update buildWon and buildLost
  insert(itemBuild, winner) {
    let node = this.head;
    // Always increment the head, as it signifies the number of times this champ was played
    node.count += 1;

    if (winner) {
      node.buildWon += 1;
    } else {
      node.buildLost += 1;
    }

    _.forEach(itemBuild, (item) => {
      if (!(item in node.children)) {
        node.children[item] = new Node();
      }

      node = node.children[item];
      node.count += 1;

      if (winner) {
        node.buildWon += 1;
      } else {
        node.buildLost += 1;
      }
    });

    node.endedHere += 1;
  }

  // Function to recursively 'normalize' the count value of a Trie, by scaling
  // up all children values until their sum matches the parent's count
  recursiveNormalize(node) {
    let shortedRatio;
    if (Object.keys(node.children).length !== 0) {
      const childrenSum = _(node.children)
        .keys()
        .reduce((sumSoFar, childKey) => sumSoFar + node.children[childKey].count, 0)
        .value();
      shortedRatio = node.count / childrenSum;
    }

    _.forEach(node.children, (child) => {
      const dummyChild = child;
      dummyChild.count = Math.round(dummyChild.count * shortedRatio);
      this.recursiveNormalize(child); // Important that recursion happens after up-scaling
    });
  }
  // Normalizes the trie to remove effects of item builds terminating early and
  // leaving the lower portions of trie with very small counts
  normalizePartialBuilds() {
    this.recursiveNormalize(this.head);
  }
  // Recursively prunes the trie down to a given number of children per node,
  // only keeping the highest count ones
  recursivePrune(n, numToKeep) {
    const node = n;
    if (Object.keys(node.children).length === 0) return;

    const sortable = [];
    _.forEach(node.children, (child, key) => {
      sortable.push([child.count, key]);
    });
    sortable.sort(comp);

    for (let i = 0; i < numToKeep && i < sortable.length; i += 1) {
      if (node.children[sortable[i][1]].count >= 3) {
        this.recursivePrune(node.children[sortable[i][1]], numToKeep);
      }
    }
    for (let i = numToKeep; i < sortable.length; i += 1) {
      delete node.children[sortable[i][1]];
    }
  }
  // Prunes the trie down to a certain number of children per node, keeping largest children
  prune(numToKeep) {
    this.recursivePrune(this.head, numToKeep);
    this.normalizePartialBuilds();
  }

  // Recursively converts the Trie data struture into a serializable object for the JSON format,
  // storing only useful data and performing minimal pre-processing
  recursiveToTreeJSON(node, tree, staticItemData) {
    _.forEach(node.children, (child, key) => {
      tree.children.push({
        name: staticItemData[key].name,
        itemId: key,
        count: child.count,
        winRate: parseFloat(
          (child.buildWon / (child.buildWon + child.buildLost))
            .toFixed(WIN_RATE_DECIMAL_NUMBERS + 2),
        ),
        children: [],
      });

      this.recursiveToTreeJSON(child, tree.children[tree.children.length - 1], staticItemData);
    });
  }

  // Converts the Trie data struture into a serializable object for the JSON format in the format
  // expected by D3.js' tree structure, storing only useful data and performing minimal
  // pre-processing
  toTreeJSON(champName, staticItemData) {
    const tree = {
      name: champName,
      count: this.head.count,
      winRate: parseFloat(
        (this.head.buildWon / (this.head.buildWon + this.head.buildLost))
          .toFixed(WIN_RATE_DECIMAL_NUMBERS + 2),
      ),
      children: [],
    };

    this.recursiveToTreeJSON(this.head, tree, staticItemData);

    return tree;
  }
}

module.exports = Trie;

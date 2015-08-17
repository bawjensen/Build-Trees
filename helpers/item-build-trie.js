var BUILD_PERCENT_THRESHOLD = 0.075;

function Node() {
    this.count = 0;
    this.endedHere = 0;
    this.children = {};
}

function Trie() {
    this.head = new Node();
}

Trie.prototype.insert = function(item_build) {
    var node = this.head;
    ++node.count;

    for (let item of item_build) {
        if (!(item in node.children)) {
            node.children[item] = new Node();
        }

        ++node.children[item].count; // Counts all parts of a build
        node = node.children[item];
    }

    ++node.endedHere;
};

function recursiveNormalize_v3(node) {
    var shortedRatio;
    if (Object.keys(node.children).length !== 0) {
        let childrenSum = Object.keys(node.children).reduce(function(sumSoFar, childKey) { return sumSoFar + node.children[childKey].count; }, 0);
        shortedRatio =  node.count / childrenSum;
        // console.log(node.count, childrenSum, shortedRatio);
    }

    for (var key in node.children) {
        node.children[key].count = Math.round(node.children[key].count * shortedRatio);
        recursiveNormalize_v3(node.children[key]);
    }
}
// More "true", but things become small near the end
function recursiveNormalize_v2(node, numToKeep) {
    var shortedRatio;
    if (Object.keys(node.children).length !== 0) {
        let childrenSum = (node.count - node.endedHere);
        shortedRatio = ((node.endedHere * numToKeep) + childrenSum) / childrenSum;
    }

    for (var key in node.children) {
        node.children[key].count = Math.round(node.children[key].count * shortedRatio);
        recursiveNormalize_v2(node.children[key], numToKeep);
    }
}
// Makes everything more visible, but downside is children are sometimes bigger than parents
function recursiveNormalize(node, numToKeep, cumulativeShorted) {
    if (Object.keys(node.children).length !== 0) {
        var childrenSum = (node.count - node.endedHere);
        var shouldBe = ((node.endedHere + cumulativeShorted) * numToKeep) + childrenSum;
        var shortedRatio = shouldBe / childrenSum;
    }

    for (var key in node.children) {
        recursiveNormalize(node.children[key], numToKeep, cumulativeShorted + node.endedHere);
        node.children[key].count = Math.round(node.children[key].count * shortedRatio);
    }
}
Trie.prototype.normalizePartialBuilds = function(numToKeep) {
    // recursiveNormalize(this.head, numToKeep, 0);
    // recursiveNormalize_v2(this.head, numToKeep);
    recursiveNormalize_v3(this.head);
}

function comp(a, b) {
    return b[0] - a[0];
}
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
Trie.prototype.prune = function(numToKeep) {
    recursivePrune(this.head, numToKeep);
    this.normalizePartialBuilds(numToKeep);
}

function recursiveToJSON(node, data, parentIndex, parentCount, nodeLabel, staticItemData) {
    if ((node.count / parentCount) < BUILD_PERCENT_THRESHOLD) return;

    var index = data.nodes.length; // Index of the item about the be pushed
    data.nodes.push({ name: nodeLabel });
    data.links.push({ source: parentIndex, target: index, value: (nodeLabel !== '' ? node.count : 0) }); // Hiding empty nodes by giving 0 width

    for (var key in node.children) {
        recursiveToJSON(node.children[key],
            data,
            index,
            node.count,
            key !== 'null' ? staticItemData[key].name : '',
            staticItemData);
    }
}
Trie.prototype.toJSON = function(champName, staticItemData) {
    var data = { nodes: [], links: [] };

    data.nodes.push({ name: champName });
    for (var key in this.head.children) {
        recursiveToJSON(this.head.children[key], data, 0, this.head.count, (key !== 'null' ? staticItemData[key].name : ''), staticItemData);
    }

    return JSON.stringify(data);
}

function recursiveBubble(node, partialsCount) {
    node.count += partialsCount;
    for (var key in node.children) {
        recursiveBubble(node.children[key], partialsCount + node.endedHere);
    }
}
Trie.prototype.bubblePartialBuilds = function() {
    recursiveBubble(this.head, 0);
}

function recursiveToTreeJSON(node, tree, staticItemData) {
    for (var key in node.children) {
        tree.children.push({
            name: staticItemData[key].name,
            itemId: key,
            weight: node.children[key].count,
            children: []
        });
        recursiveToTreeJSON(node.children[key], tree.children[tree.children.length-1], staticItemData);
    }
}
Trie.prototype.toTreeJSON = function(champName, staticItemData) {
    var tree = {
        name: champName,
        weight: this.head.count,
        children: []
    };

    recursiveToTreeJSON(this.head, tree, staticItemData);

    return tree;
}

module.exports = Trie;
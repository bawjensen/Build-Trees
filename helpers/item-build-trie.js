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
}

function recursiveToString(node, count, buildSoFar, buffer, staticItemData) {
    if (!Object.keys(node.children).length)
        buffer.str += buildSoFar + '\n';
        // buffer.str += buildSoFar + ': ' + count + '\n';

    for (var key in node.children) {
        recursiveToString(node.children[key], // Recurse on child
            count + node.children[key].count, // Add the count for all partial builds to the final build
            buildSoFar + ' =' + node.children[key].count + '=> ' + (key in staticItemData ? staticItemData[key].name : ''), // Append the name of the build, so we can print it
            buffer, // Pass along the buffer that we're building up
            staticItemData); // Pass along the static data
    }
}
Trie.prototype.toString = function(staticItemData) {
    var buffer = { str: '' };
    recursiveToString(this.head, 0, '', buffer, staticItemData);
    return buffer.str;
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
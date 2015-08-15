var BUILD_PERCENT_THRESHOLD = 0.1;

function Node() {
    this.count = 0;
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
};

function recursiveToString(node, count, buildSoFar, buffer, staticItemData) {
    if (!Object.keys(node.children).length)
        buffer.str += buildSoFar + '\n';
        // buffer.str += buildSoFar + ': ' + count + '\n';

    for (var key in node.children) {
        recursiveToString(node.children[key], // Recurse on child
            count + node.children[key].count, // Add the count for all partial builds to the final build
            buildSoFar + ' =' + node.children[key].count + '=> ' + staticItemData[key].name, // Append the name of the build, so we can print it
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
    data.links.push({ source: parentIndex, target: index, value: node.count });

    for (var key in node.children) {
        recursiveToJSON(node.children[key],
            data,
            index,
            node.count,
            staticItemData[key].name,
            staticItemData);
    }
}
Trie.prototype.toJSON = function(champName, staticItemData) {
    var data = { nodes: [], links: [] };

    data.nodes.push({ name: champName });
    for (var key in this.head.children) {
        recursiveToJSON(this.head.children[key], data, 0, this.head.count, staticItemData[key].name, staticItemData);
    }

    return JSON.stringify(data);
}

module.exports = Trie;
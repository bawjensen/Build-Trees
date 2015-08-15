function Node() {
    this.count = 0;
    this.children = {};
}

function Trie() {
    this.head = new Node();
}

// function incrementRecursive(node) {
//     Object.keys(node.children).forEach(function(childItemId) {
//         ++node.children[childItemId].count;
//         incrementRecursive(node.children[childItemId]);
//     });
// }
Trie.prototype.insert = function(item_build) {
    var node = this.head;
    // console.log('item_build:', item_build);
    for (let item of item_build) {
        if (!(item in node.children)) {
            node.children[item] = new Node();
        }

        // ++node.count; // Counts all future builds for earlier pieces
        node = node.children[item];
    }

    ++node.count; // Counts all builds by where they end
};

function recursiveToString(node, count, buildSoFar, buffer, staticItemData) {
    if (!Object.keys(node.children).length)
        buffer.str += buildSoFar + ': ' + count + '\n';

    for (var key in node.children) {
        recursiveToString(node.children[key], // Recurse on child
            count + node.children[key].count, // Add the count for all partial builds to the final build
            buildSoFar + staticItemData[key].name + ' -> ', // Append the name of the build, so we can print it
            buffer, // Pass along the buffer that we're building up
            staticItemData); // Pass along the static data
    }
}
Trie.prototype.toString = function(staticItemData) {
    var buffer = { str: '' };
    recursiveToString(this.head, 0, '', buffer, staticItemData);
    return buffer.str;
}

module.exports = Trie;
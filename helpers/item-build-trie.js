function Node() {
    this.count = 0;
    this.children = {};
}

function incrementRecursive(node) {
    Object.keys(node.children).forEach(function(childItemId) {
        // console.log('\tAlso incrementing', childItemId);
        ++node.children[childItemId].count;
        incrementRecursive(node.children[childItemId]);
    });
}

function Trie() {
    this.head = new Node();
}

Trie.prototype.insert = function(item_build) {
    var node = this.head;
    // console.log('item_build:', item_build);
    for (let item of item_build) {
        if (!(item in node.children)) {
            node.children[item] = new Node();
        }

        node = node.children[item];
        ++node.count;
    }

    // Count a partial build to every possible subsequent build
    // console.log('Adding to all possible builds');
    incrementRecursive(node);
};

function recursiveToString(node, depth, buffer, staticItemData) {
    for (var key in node.children) {
        buffer.str += ('  '.repeat(depth) + staticItemData[key].name) + '\n';
        recursiveToString(node.children[key], depth + 1, buffer, staticItemData);
    }
}
Trie.prototype.toString = function(staticItemData) {
    var buffer = { str: '' };
    recursiveToString(this.head, 0, buffer, staticItemData);
    return buffer.str;
}

module.exports = Trie;
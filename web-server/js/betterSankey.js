var fbMask = d3.select(document.getElementById('fbMask'));

function fb_mouseOver() {
    fbMask.style('display', 'none');
};

function fb_mouseOut() {
    fbMask.style('display', 'block');
};
var m = [20, 120, 20, 120],
    w = 1280 - m[1] - m[3],
    h = 900 - m[0] - m[2],
    i = 0,
    root = {};
var spendField = 'sum_Federal';
var actField = 'sum_Federal';
var sumFields = ['Federal', 'GovXFer', 'State', 'Local'];
var sourceFields = ['Category', 'Level1', 'Level2', 'Level3', 'Level4'];
var colors = ['#bd0026', '#fecc5c', '#fd8d3c', '#f03b20', '#B02D5D', '#9B2C67', '#982B9A', '#692DA7', '#5725AA', '#4823AF', '#d7b5d8', '#dd1c77', '#5A0C7A', '#5A0C7A'];
var formatNumber = d3.format(',.3f');
var formatCurrency = function(node) {
    return '$' + formatNumber(node) + ' Billion';
};
var tree = d3.layout.tree();
tree.children(function(node) {
    return node.values;
});
tree.size([h, w]);
var toolTip = d3.select(document.getElementById('toolTip'));
var header = d3.select(document.getElementById('head'));
var header1 = d3.select(document.getElementById('header1'));
var header2 = d3.select(document.getElementById('header2'));
var fedSpend = d3.select(document.getElementById('fedSpend'));
var stateSpend = d3.select(document.getElementById('stateSpend'));
var localSpend = d3.select(document.getElementById('localSpend'));
var federalButton = d3.select(document.getElementById('federalButton'));
var stateButton = d3.select(document.getElementById('stateButton'));
var localButton = d3.select(document.getElementById('localButton'));
var federalDiv = d3.select(document.getElementById('federalDiv'));
var stateDiv = d3.select(document.getElementById('stateDiv'));
var localDiv = d3.select(document.getElementById('localDiv'));
var diagonal = d3.svg.diagonal().projection(function(node) {
    return [node.y, node.x];
});
var vis = d3.select('#body').append('svg:svg').attr('width', w + m[1] + m[3]).attr('height', h + m[0] + m[2]).append('svg:g').attr('transform', 'translate(' + m[3] + ',' + m[0] + ')');
var level1Max = {};
var level2Max = {};
var level3Max = {};
var level4Max = {};
var level1Radius;
var level2Radius;
var level3Radius;
var level4Radius;
var alreadySummed = false;
d3.csv('/data/FederalBudget_2013_a.csv', function(csvDataRows) {
    console.log('loaded data', csvDataRows);
    var nodeArray = [];
    csvDataRows.forEach(function(node) {
        var sum = 0;
        for (var i = 0; i < sumFields.length; i++) {
            sum += Number(node[sumFields[i]]);
        };
        if (sum > 0) {
            nodeArray.push(node);
        };
    });
    var nestedData = d3.nest().key(function(node) {
        return node.Level1;
    }).key(function(node) {
        return node.Level2;
    }).key(function(node) {
        return node.Level3;
    }).entries(nodeArray);
    root = {};
    root.values = nestedData;
    root.x0 = h / 2;
    root.y0 = 0;
    var nodesList = tree.nodes(root).reverse();
    tree.children(function(node) {
        return node.children;
    });
    initializeSumFields();
    initializeRadii();
    alreadySummed = true;
    root.values.forEach(rescursiveToggle);
    toggle(root.values[2]);
    update(root);
    stateButton.on('click', function(node) {
        stateButton.attr('class', 'selected');
        federalButton.attr('class', null);
        localButton.attr('class', null);
        stateDiv.attr('class', 'selected');
        federalDiv.attr('class', null);
        localDiv.attr('class', null);
        spendField = 'sum_State';
        actField = 'sum_State';
        initializeRadii();
        update(root);
    });
    localButton.on('click', function(node) {
        localButton.attr('class', 'selected');
        stateButton.attr('class', null);
        federalButton.attr('class', null);
        localDiv.attr('class', 'selected');
        federalDiv.attr('class', null);
        stateDiv.attr('class', null);
        spendField = 'sum_Local';
        actField = 'sum_Local';
        initializeRadii();
        update(root);
    });
    federalButton.on('click', function(node) {
        federalButton.attr('class', 'selected');
        stateButton.attr('class', null);
        localButton.attr('class', null);
        federalDiv.attr('class', 'selected');
        stateDiv.attr('class', null);
        localDiv.attr('class', null);
        spendField = 'sum_Federal';
        initializeRadii();
        update(root);
    });

    function initializeSumFields() {
        for (var i = 0; i < sumFields.length; i++) {
            level1Max['sum_' + sumFields[i]] = 0;
            level2Max['sum_' + sumFields[i]] = 0;
            level3Max['sum_' + sumFields[i]] = 0;
            level4Max['sum_' + sumFields[i]] = 0;
        };
        sumNodes(root.children);
    };

    function initializeRadii() {
        level1Radius = d3.scale.sqrt().domain([0, level1Max[spendField]]).range([1, 40]);
        level2Radius = d3.scale.sqrt().domain([0, level2Max[spendField]]).range([1, 40]);
        level3Radius = d3.scale.sqrt().domain([0, level3Max[spendField]]).range([1, 40]);
        level4Radius = d3.scale.sqrt().domain([0, level4Max[spendField]]).range([1, 40]);
    };

    function rescursiveToggle(node) {
        if (node.values && node.values.actuals) {
            node.values.actuals.forEach(rescursiveToggle);
            toggle(node);
        }
        else if (node.values) {
            node.values.forEach(rescursiveToggle);
            toggle(node);
        };
    };
});

function setSourceFields(childNode, parentNode) {
    if (parentNode) {
        for (var i = 0; i < sourceFields.length; i++) {
            var sourceField = sourceFields[i];
            if (childNode[sourceField] != undefined) {
                childNode['source_' + sourceField] = childNode[sourceField];
            };
            parentNode['source_' + sourceField] = (childNode['source_' + sourceField]) ? childNode['source_' + sourceField] : childNode[sourceField];
        };
    };
};

function sumNodes(nodesList) {
    for (var index = 0; index < nodesList.length; index++) {
        var tempNode = nodesList[index];
        if (tempNode.children) {
            sumNodes(tempNode.children);
            for (var indexJ = 0; indexJ < tempNode.children.length; indexJ++) {
                var childNode = tempNode.children[indexJ];
                for (var i = 0; i < sumFields.length; i++) {
                    if (isNaN(tempNode['sum_' + sumFields[i]])) {
                        tempNode['sum_' + sumFields[i]] = 0;
                    };
                    tempNode['sum_' + sumFields[i]] += Number(childNode['sum_' + sumFields[i]]);
                    if ((tempNode.parent)) {
                        if (tempNode.depth == 1) {
                            level1Max['sum_' + sumFields[i]] = Math.max(level1Max['sum_' + sumFields[i]], Number(tempNode['sum_' + sumFields[i]]));
                        }
                        else if (tempNode.depth == 2) {
                            level2Max['sum_' + sumFields[i]] = Math.max(level2Max['sum_' + sumFields[i]], Number(tempNode['sum_' + sumFields[i]]));
                        }
                        else if (tempNode.depth == 3) {
                            level3Max['sum_' + sumFields[i]] = Math.max(level3Max['sum_' + sumFields[i]], Number(tempNode['sum_' + sumFields[i]]));
                        }
                        else if (tempNode.depth == 4) {
                            level4Max['sum_' + sumFields[i]] = Math.max(level4Max['sum_' + sumFields[i]], Number(tempNode['sum_' + sumFields[i]]));
                        };
                        setSourceFields(tempNode, tempNode.parent);
                    };
                };
            };
        }
        else {
            for (var i = 0; i < sumFields.length; i++) {
                tempNode['sum_' + sumFields[i]] = Number(tempNode[sumFields[i]]);
                if (isNaN(tempNode['sum_' + sumFields[i]])) {
                    tempNode['sum_' + sumFields[i]] = 0;
                };
            };
        };
        setSourceFields(tempNode, tempNode.parent);
    };
};

function update(aNode) {
    var duration = d3.event && d3.event.altKey ? 5000 : 500;
    var nodesList = tree.nodes(root).reverse();
    var tempIndex = 0;
    nodesList.forEach(function(node) {
        node.y = node.depth * 180;
        node.numChildren = (node.children) ? node.children.length : 0;
        if (node.depth == 1) {
            node.linkColor = colors[(tempIndex % (colors.length - 1))];
            tempIndex++;
        };
        if (node.numChildren == 0 && node._children) {
            node.numChildren = node._children.length;
        };
    });
    nodesList.forEach(function(node) {
        var iterNode = node;
        while ((iterNode.source && iterNode.source.depth > 1) || iterNode.depth > 1) {
            iterNode = (iterNode.source) ? iterNode.source.parent : iterNode.parent;
        };
        node.linkColor = (iterNode.source) ? iterNode.source.linkColor : iterNode.linkColor;
    });
    var tempNode = vis.selectAll('g.node').data(nodesList, function(node) {
        return node.id || (node.id = ++i);
    });
    var subNodes = tempNode.enter().append('svg:g').attr('class', 'node').attr('transform', function(node) {
        return 'translate(' + aNode.y0 + ',' + aNode.x0 + ')';
    }).on('click', function(node) {
        if (node.numChildren > 50) {
            alert(node.key + ' has too many departments (' + node.numChildren + ') to view at once.');
        } else {
            toggle(node);
            update(node);
        };
    });
    subNodes.append('svg:circle').attr('r', 1e-6).on('mouseover', function(node) {
        mouseOver(node);
    }).on('mouseout', function(node) {
        toolTip.transition().duration(500).style('opacity', '0');
    }).style('fill', function(node) {
        return node.source ? node.source.linkColor : node.linkColor;
    }).style('fill-opacity', '.8').style('stroke', function(node) {
        return node.source ? node.source.linkColor : node.linkColor;
    });
    subNodes.append('svg:text').attr('x', function(node) {
        return node.children || node._children ? -10 : 10;
    }).attr('dy', '.35em').attr('text-anchor', function(node) {
        return node.children || node._children ? 'end' : 'start';
    }).text(function(node) {
        var strValue = (node.depth == 4) ? node.Level4 : node.key;
        strValue = (String(strValue).length > 25) ? String(strValue).substr(0, 22) + '...' : strValue;
        return strValue;
    }).on('mouseover', function(node) {
        mouseOver(node);
    }).on('mouseout', function(node) {
        toolTip.transition().duration(500).style('opacity', '0');
    }).style('fill-opacity', '0');
    var translation = tempNode.transition().duration(duration).attr('transform', function(node) {
        return 'translate(' + node.y + ',' + node.x + ')';
    });
    translation.select('circle').attr('r', function(node) {
        if (node.depth == 0) {
            return 10;
        }
        else if (node.depth == 1) {
            var weightValue = level1Radius(node[spendField]);
            return (isNaN(weightValue) ? 2 : weightValue);
        }
        else if (node.depth == 2) {
            var weightValue = level2Radius(node[spendField]);
            return (isNaN(weightValue) ? 2 : weightValue);
        }
        else if (node.depth == 3) {
            var weightValue = level3Radius(node[spendField]);
            return (isNaN(weightValue) ? 2 : weightValue);
        }
        else if (node.depth == 4) {
            var weightValue = level4Radius(node[spendField]);
            return (isNaN(weightValue) ? 2 : weightValue);
        };
    }).style('fill', function(node) {
        return node.source ? node.source.linkColor : node.linkColor;
    }).style('fill-opacity', function(node) {
        var weightValue = ((node.depth + 1) / 5);
        return weightValue;
    });
    translation.select('text').style('fill-opacity', 1);
    var translation_v2 = tempNode.exit().transition().duration(duration).attr('transform', function(node) {
        return 'translate(' + aNode.y + ',' + aNode.x + ')';
    }).remove();
    translation_v2.select('circle').attr('r', 1e-6);
    translation_v2.select('text').style('fill-opacity', 1e-6);
    var paths = vis.selectAll('path.link').data(tree.links(nodesList), function(node) {
        return node.target.id;
    });
    var index = 0;
    paths.enter().insert('svg:path', 'g').attr('class', 'link').attr('d', function(node) {
        if (Number(node.target[spendField]) > 0) {
            var position = {
                x: aNode.x0,
                y: aNode.y0
            };
            return diagonal({
                source: position,
                target: position
            });
        } else {
            null;
        };
    }).style('stroke', function(node, i) {
        if (node.source.depth == 0) {
            index++;
            return (node.source.children[index - 1].linkColor);
        } else {
            return (node.source) ? node.source.linkColor : node.linkColor;
        };
    }).style('stroke-width', function(node, i) {
        if (node.source.depth == 0) {
            var weightValue = level1Radius(node.target[spendField]) * 2;
            return (isNaN(weightValue) ? 4 : weightValue);
        }
        else if (node.source.depth == 1) {
            var weightValue = level2Radius(node.target[spendField]) * 2;
            return (isNaN(weightValue) ? 4 : weightValue);
        }
        else if (node.source.depth == 2) {
            var weightValue = level3Radius(node.target[spendField]) * 2;
            return (isNaN(weightValue) ? 4 : weightValue);
        }
        else if (node.source.depth == 3) {
            var weightValue = level4Radius(node.target[spendField]) * 2;
            return (isNaN(weightValue) ? 4 : weightValue);
        };
    }).style('stroke-opacity', function(node) {
        var weightValue = ((node.source.depth + 1) / 4.5);
        if (node.target[spendField] <= 0) {
            weightValue = 0.1;
        };
        return weightValue;
    }).style('stroke-linecap', 'round').transition().duration(duration);
    var link = paths.transition().duration(duration).attr('d', diagonal);
    link.style('stroke-width', function(node, i) {
        if (node.source.depth == 0) {
            var weightValue = level1Radius(Number(node.target[spendField])) * 2;
            return (isNaN(weightValue) ? 4 : weightValue);
        }
        else if (node.source.depth == 1) {
            var weightValue = level2Radius(Number(node.target[spendField])) * 2;
            return (isNaN(weightValue) ? 4 : weightValue);
        }
        else if (node.source.depth == 2) {
            var weightValue = level3Radius(Number(node.target[spendField])) * 2;
            return (isNaN(weightValue) ? 4 : weightValue);
        }
        else if (node.source.depth == 3) {
            var weightValue = level4Radius(Number(node.target[spendField])) * 2;
            return (isNaN(weightValue) ? 4 : weightValue);
        };
    }).style('stroke-opacity', function(node) {
        var weightValue = ((node.source.depth + 1) / 4.5);
        if (node.target[spendField] <= 0) {
            weightValue = 0.1;
        };
        return weightValue;
    });
    paths.exit().transition().duration(duration).attr('d', diagonal).remove();
    nodesList.forEach(function(node) {
        node.x0 = node.x;
        node.y0 = node.y;
    });

    function mouseOver(node) {
        toolTip.transition().duration(200).style('opacity', '.9');
        // header.text(node.source_Level1);
        // header1.text((node.depth > 1) ? node.source_Level2 : '');
        // header2.html((node.depth > 2) ? node.source_Level3 : '');
        header.text('hello!');
        if (node.depth > 3) {
            header2.html(header2.html() + ' - ' + node.source_Level4);
        };
        // fedSpend.text(formatCurrency(node.sum_Federal));
        // stateSpend.text(formatCurrency(node.sum_State));
        // localSpend.text(formatCurrency(node.sum_Local));
        toolTip.style('left', (d3.event.pageX + 15) + 'px').style('top', (d3.event.pageY - 75) + 'px');
    };
};

function toggleButton(button) {
    button.attr('class', 'selected');
    if (button == federalButton) {
        localButton.attr('class', 'unselected');
        stateButton.attr('class', 'unselected');
    }
    else if (button == stateButton) {
        localButton.attr('class', 'unselected');
        federalButton.attr('class', 'unselected');
    }
    else {
        federalButton.attr('class', 'unselected');
        stateButton.attr('class', 'unselected');
    };
};

function toggle(node) {
    if (node.children) {
        node._children = node.children;
        node.children = null;
    }
    else {
        node.children = node._children;
        node._children = null;
    };
};
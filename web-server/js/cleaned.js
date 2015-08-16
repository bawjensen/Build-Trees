
var _0x6780 = ["fbMask", "getElementById", "select", "display", "none", "style", "block", "sum_Federal", "Federal", "GovXFer", "State", "Local", "Category", "Level1", "Level2", "Level3", "Level4", "#bd0026", "#fecc5c", "#fd8d3c", "#f03b20", "#B02D5D", "#9B2C67", "#982B9A", "#692DA7", "#5725AA", "#4823AF", "#d7b5d8", "#dd1c77", "#5A0C7A", ",.3f", "format", "$", " Billion", "tree", "layout", "values", "children", "size", "toolTip", "head", "header1", "header2", "fedSpend", "stateSpend", "localSpend", "federalButton", "stateButton", "localButton", "federalDiv", "stateDiv", "localDiv", "y", "x", "projection", "diagonal", "svg", "transform", "translate(", ",", ")", "attr", "svg:g", "append", "height", "width", "svg:svg", "#body", "/data/FederalBudget_2013_a.csv", "length", "push", "forEach", "entries", "key", "nest", "x0", "y0", "reverse", "nodes", "click", "class", "selected", "sum_State", "on", "sum_Local", "sum_", "range", "domain", "sqrt", "scale", "actuals", "csv", "source_", "parent", "depth", "max", "event", "altKey", "numChildren", "linkColor", "_children", "source", "id", "data", "g.node", "selectAll", " has too many departments (", ") to view at once.", "node", "enter", "stroke", "fill-opacity", ".8", "fill", "mouseout", "opacity", "0", "duration", "transition", "mouseover", "r", "svg:circle", "substr", "...", "text", "text-anchor", "end", "start", "dy", ".35em", "svg:text", "circle", "remove", "exit", "links", "target", "path.link", "stroke-linecap", "round", "stroke-opacity", "stroke-width", "d", "link", "svg:path", "g", "insert", ".9", "source_Level1", "source_Level2", "", "source_Level3", "html", " - ", "source_Level4", "top", "pageY", "px", "left", "pageX", "unselected"];
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
var formatCurrency = function(_0xe16ax10) {
    return '$' + formatNumber(_0xe16ax10) + ' Billion';
};
var tree = d3.layout.tree();
tree.children(function(_0xe16ax10) {
    return _0xe16ax10.values;
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
var diagonal = d3.svg.diagonal().projection(function(_0xe16ax10) {
    return [_0xe16ax10.y, _0xe16ax10.x];
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
d3.csv('FederalBudget_2013_a.csv', function(_0xe16ax2a) {
    console.log('loaded data', _0xe16ax2a);
    var _0xe16ax2b = [];
    _0xe16ax2a.forEach(function(_0xe16ax10) {
        var _0xe16ax2c = 0;
        for (var i = 0; i < sumFields.length; i++) {
            _0xe16ax2c += Number(_0xe16ax10[sumFields[i]]);
        };
        if (_0xe16ax2c > 0) {
            _0xe16ax2b.push(_0xe16ax10);
        };
    });
    var _0xe16ax2d = d3.nest().key(function(_0xe16ax10) {
        return _0xe16ax10.Level1;
    }).key(function(_0xe16ax10) {
        return _0xe16ax10.Level2;
    }).key(function(_0xe16ax10) {
        return _0xe16ax10.Level3;
    }).entries(_0xe16ax2b);
    root = {};
    root.values = _0xe16ax2d;
    root.x0 = h / 2;
    root.y0 = 0;
    var _0xe16ax2e = tree.nodes(root).reverse();
    tree.children(function(_0xe16ax10) {
        return _0xe16ax10.children;
    });
    _0xe16ax2f();
    _0xe16ax30();
    alreadySummed = true;
    root.values.forEach(_0xe16ax31);
    toggle(root.values[2]);
    update(root);
    stateButton.on('click', function(_0xe16ax10) {
        stateButton.attr('class', 'selected');
        federalButton.attr('class', null);
        localButton.attr('class', null);
        stateDiv.attr('class', 'selected');
        federalDiv.attr('class', null);
        localDiv.attr('class', null);
        spendField = 'sum_State';
        actField = 'sum_State';
        _0xe16ax30();
        update(root);
    });
    localButton.on('click', function(_0xe16ax10) {
        localButton.attr('class', 'selected');
        stateButton.attr('class', null);
        federalButton.attr('class', null);
        localDiv.attr('class', 'selected');
        federalDiv.attr('class', null);
        stateDiv.attr('class', null);
        spendField = 'sum_Local';
        actField = 'sum_Local';
        _0xe16ax30();
        update(root);
    });
    federalButton.on('click', function(_0xe16ax10) {
        federalButton.attr('class', 'selected');
        stateButton.attr('class', null);
        localButton.attr('class', null);
        federalDiv.attr('class', 'selected');
        stateDiv.attr('class', null);
        localDiv.attr('class', null);
        spendField = 'sum_Federal';
        _0xe16ax30();
        update(root);
    });

    function _0xe16ax2f() {
        for (var i = 0; i < sumFields.length; i++) {
            level1Max['sum_' + sumFields[i]] = 0;
            level2Max['sum_' + sumFields[i]] = 0;
            level3Max['sum_' + sumFields[i]] = 0;
            level4Max['sum_' + sumFields[i]] = 0;
        };
        sumNodes(root.children);
    };

    function _0xe16ax30() {
        level1Radius = d3.scale.sqrt().domain([0, level1Max[spendField]]).range([1, 40]);
        level2Radius = d3.scale.sqrt().domain([0, level2Max[spendField]]).range([1, 40]);
        level3Radius = d3.scale.sqrt().domain([0, level3Max[spendField]]).range([1, 40]);
        level4Radius = d3.scale.sqrt().domain([0, level4Max[spendField]]).range([1, 40]);
    };

    function _0xe16ax31(_0xe16ax10) {
        if (_0xe16ax10.values && _0xe16ax10.values.actuals) {
            _0xe16ax10.values.actuals.forEach(_0xe16ax31);
            toggle(_0xe16ax10);
        } else {
            if (_0xe16ax10.values) {
                _0xe16ax10.values.forEach(_0xe16ax31);
                toggle(_0xe16ax10);
            };
        };
    };
});

function setSourceFields(_0xe16ax33, _0xe16ax34) {
    if (_0xe16ax34) {
        for (var i = 0; i < sourceFields.length; i++) {
            var _0xe16ax35 = sourceFields[i];
            if (_0xe16ax33[_0xe16ax35] != undefined) {
                _0xe16ax33['source_' + _0xe16ax35] = _0xe16ax33[_0xe16ax35];
            };
            _0xe16ax34['source_' + _0xe16ax35] = (_0xe16ax33['source_' + _0xe16ax35]) ? _0xe16ax33['source_' + _0xe16ax35] : _0xe16ax33[_0xe16ax35];
        };
    };
};

function sumNodes(_0xe16ax2e) {
    for (var _0xe16ax37 = 0; _0xe16ax37 < _0xe16ax2e.length; _0xe16ax37++) {
        var _0xe16ax38 = _0xe16ax2e[_0xe16ax37];
        if (_0xe16ax38.children) {
            sumNodes(_0xe16ax38.children);
            for (var _0xe16ax39 = 0; _0xe16ax39 < _0xe16ax38.children.length; _0xe16ax39++) {
                var _0xe16ax33 = _0xe16ax38.children[_0xe16ax39];
                for (var i = 0; i < sumFields.length; i++) {
                    if (isNaN(_0xe16ax38['sum_' + sumFields[i]])) {
                        _0xe16ax38['sum_' + sumFields[i]] = 0;
                    };
                    _0xe16ax38['sum_' + sumFields[i]] += Number(_0xe16ax33['sum_' + sumFields[i]]);
                    if ((_0xe16ax38.parent)) {
                        if (_0xe16ax38.depth == 1) {
                            level1Max['sum_' + sumFields[i]] = Math.max(level1Max['sum_' + sumFields[i]], Number(_0xe16ax38['sum_' + sumFields[i]]));
                        } else {
                            if (_0xe16ax38.depth == 2) {
                                level2Max['sum_' + sumFields[i]] = Math.max(level2Max['sum_' + sumFields[i]], Number(_0xe16ax38['sum_' + sumFields[i]]));
                            } else {
                                if (_0xe16ax38.depth == 3) {
                                    level3Max['sum_' + sumFields[i]] = Math.max(level3Max['sum_' + sumFields[i]], Number(_0xe16ax38['sum_' + sumFields[i]]));
                                } else {
                                    if (_0xe16ax38.depth == 4) {
                                        level4Max['sum_' + sumFields[i]] = Math.max(level4Max['sum_' + sumFields[i]], Number(_0xe16ax38['sum_' + sumFields[i]]));
                                    };
                                };
                            };
                        };
                        setSourceFields(_0xe16ax38, _0xe16ax38.parent);
                    };
                };
            };
        } else {
            for (var i = 0; i < sumFields.length; i++) {
                _0xe16ax38['sum_' + sumFields[i]] = Number(_0xe16ax38[sumFields[i]]);
                if (isNaN(_0xe16ax38['sum_' + sumFields[i]])) {
                    _0xe16ax38['sum_' + sumFields[i]] = 0;
                };
            };
        };
        setSourceFields(_0xe16ax38, _0xe16ax38.parent);
    };
};

function update(_0xe16ax3b) {
    var _0xe16ax3c = d3.event && d3.event.altKey ? 5000 : 500;
    var _0xe16ax2e = tree.nodes(root).reverse();
    var _0xe16ax3d = 0;
    _0xe16ax2e.forEach(function(_0xe16ax10) {
        _0xe16ax10.y = _0xe16ax10.depth * 180;
        _0xe16ax10.numChildren = (_0xe16ax10.children) ? _0xe16ax10.children.length : 0;
        if (_0xe16ax10.depth == 1) {
            _0xe16ax10.linkColor = colors[(_0xe16ax3d % (colors.length - 1))];
            _0xe16ax3d++;
        };
        if (_0xe16ax10.numChildren == 0 && _0xe16ax10._children) {
            _0xe16ax10.numChildren = _0xe16ax10._children.length;
        };
    });
    _0xe16ax2e.forEach(function(_0xe16ax10) {
        var _0xe16ax3e = _0xe16ax10;
        while ((_0xe16ax3e.source && _0xe16ax3e.source.depth > 1) || _0xe16ax3e.depth > 1) {
            _0xe16ax3e = (_0xe16ax3e.source) ? _0xe16ax3e.source.parent : _0xe16ax3e.parent;
        };
        _0xe16ax10.linkColor = (_0xe16ax3e.source) ? _0xe16ax3e.source.linkColor : _0xe16ax3e.linkColor;
    });
    var _0xe16ax38 = vis.selectAll('g.node').data(_0xe16ax2e, function(_0xe16ax10) {
        return _0xe16ax10.id || (_0xe16ax10.id = ++i);
    });
    var _0xe16ax3f = _0xe16ax38.enter().append('svg:g').attr('class', 'node').attr('transform', function(_0xe16ax10) {
        return 'translate(' + _0xe16ax3b.y0 + ',' + _0xe16ax3b.x0 + ')';
    }).on('click', function(_0xe16ax10) {
        if (_0xe16ax10.numChildren > 50) {
            alert(_0xe16ax10.key + ' has too many departments (' + _0xe16ax10.numChildren + ') to view at once.');
        } else {
            toggle(_0xe16ax10);
            update(_0xe16ax10);
        };
    });
    _0xe16ax3f.append('svg:circle').attr('r', 1e-6).on('mouseover', function(_0xe16ax10) {
        _0xe16ax47(_0xe16ax10);
    }).on('mouseout', function(_0xe16ax10) {
        toolTip.transition().duration(500).style('opacity', '0');
    }).style('fill', function(_0xe16ax10) {
        return _0xe16ax10.source ? _0xe16ax10.source.linkColor : _0xe16ax10.linkColor;
    }).style('fill-opacity', '.8').style('stroke', function(_0xe16ax10) {
        return _0xe16ax10.source ? _0xe16ax10.source.linkColor : _0xe16ax10.linkColor;
    });
    _0xe16ax3f.append('svg:text').attr('x', function(_0xe16ax10) {
        return _0xe16ax10.children || _0xe16ax10._children ? -10 : 10;
    }).attr('dy', '.35em').attr('text-anchor', function(_0xe16ax10) {
        return _0xe16ax10.children || _0xe16ax10._children ? 'end' : 'start';
    }).text(function(_0xe16ax10) {
        var _0xe16ax40 = (_0xe16ax10.depth == 4) ? _0xe16ax10.Level4 : _0xe16ax10.key;
        _0xe16ax40 = (String(_0xe16ax40).length > 25) ? String(_0xe16ax40).substr(0, 22) + '...' : _0xe16ax40;
        return _0xe16ax40;
    }).on('mouseover', function(_0xe16ax10) {
        _0xe16ax47(_0xe16ax10);
    }).on('mouseout', function(_0xe16ax10) {
        toolTip.transition().duration(500).style('opacity', '0');
    }).style('fill-opacity', '0');
    var _0xe16ax41 = _0xe16ax38.transition().duration(_0xe16ax3c).attr('transform', function(_0xe16ax10) {
        return 'translate(' + _0xe16ax10.y + ',' + _0xe16ax10.x + ')';
    });
    _0xe16ax41.select('circle').attr('r', function(_0xe16ax10) {
        if (_0xe16ax10.depth == 0) {
            return 10;
        } else {
            if (_0xe16ax10.depth == 1) {
                var _0xe16ax40 = level1Radius(_0xe16ax10[spendField]);
                return (isNaN(_0xe16ax40) ? 2 : _0xe16ax40);
            } else {
                if (_0xe16ax10.depth == 2) {
                    var _0xe16ax40 = level2Radius(_0xe16ax10[spendField]);
                    return (isNaN(_0xe16ax40) ? 2 : _0xe16ax40);
                } else {
                    if (_0xe16ax10.depth == 3) {
                        var _0xe16ax40 = level3Radius(_0xe16ax10[spendField]);
                        return (isNaN(_0xe16ax40) ? 2 : _0xe16ax40);
                    } else {
                        if (_0xe16ax10.depth == 4) {
                            var _0xe16ax40 = level4Radius(_0xe16ax10[spendField]);
                            return (isNaN(_0xe16ax40) ? 2 : _0xe16ax40);
                        };
                    };
                };
            };
        };
    }).style('fill', function(_0xe16ax10) {
        return _0xe16ax10.source ? _0xe16ax10.source.linkColor : _0xe16ax10.linkColor;
    }).style('fill-opacity', function(_0xe16ax10) {
        var _0xe16ax40 = ((_0xe16ax10.depth + 1) / 5);
        return _0xe16ax40;
    });
    _0xe16ax41.select('text').style('fill-opacity', 1);
    var _0xe16ax42 = _0xe16ax38.exit().transition().duration(_0xe16ax3c).attr('transform', function(_0xe16ax10) {
        return 'translate(' + _0xe16ax3b.y + ',' + _0xe16ax3b.x + ')';
    }).remove();
    _0xe16ax42.select('circle').attr('r', 1e-6);
    _0xe16ax42.select('text').style('fill-opacity', 1e-6);
    var _0xe16ax43 = vis.selectAll('path.link').data(tree.links(_0xe16ax2e), function(_0xe16ax10) {
        return _0xe16ax10.target.id;
    });
    var _0xe16ax44 = 0;
    _0xe16ax43.enter().insert('svg:path', 'g').attr('class', 'link').attr('d', function(_0xe16ax10) {
        if (Number(_0xe16ax10.target[spendField]) > 0) {
            var _0xe16ax45 = {
                x: _0xe16ax3b.x0,
                y: _0xe16ax3b.y0
            };
            return diagonal({
                source: _0xe16ax45,
                target: _0xe16ax45
            });
        } else {
            null;
        };
    }).style('stroke', function(_0xe16ax10, i) {
        if (_0xe16ax10.source.depth == 0) {
            _0xe16ax44++;
            return (_0xe16ax10.source.children[_0xe16ax44 - 1].linkColor);
        } else {
            return (_0xe16ax10.source) ? _0xe16ax10.source.linkColor : _0xe16ax10.linkColor;
        };
    }).style('stroke-width', function(_0xe16ax10, i) {
        if (_0xe16ax10.source.depth == 0) {
            var _0xe16ax40 = level1Radius(_0xe16ax10.target[spendField]) * 2;
            return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
        } else {
            if (_0xe16ax10.source.depth == 1) {
                var _0xe16ax40 = level2Radius(_0xe16ax10.target[spendField]) * 2;
                return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
            } else {
                if (_0xe16ax10.source.depth == 2) {
                    var _0xe16ax40 = level3Radius(_0xe16ax10.target[spendField]) * 2;
                    return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
                } else {
                    if (_0xe16ax10.source.depth == 3) {
                        var _0xe16ax40 = level4Radius(_0xe16ax10.target[spendField]) * 2;
                        return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
                    };
                };
            };
        };
    }).style('stroke-opacity', function(_0xe16ax10) {
        var _0xe16ax40 = ((_0xe16ax10.source.depth + 1) / 4.5);
        if (_0xe16ax10.target[spendField] <= 0) {
            _0xe16ax40 = 0.1;
        };
        return _0xe16ax40;
    }).style('stroke-linecap', 'round').transition().duration(_0xe16ax3c);
    var _0xe16ax46 = _0xe16ax43.transition().duration(_0xe16ax3c).attr('d', diagonal);
    _0xe16ax46.style('stroke-width', function(_0xe16ax10, i) {
        if (_0xe16ax10.source.depth == 0) {
            var _0xe16ax40 = level1Radius(Number(_0xe16ax10.target[spendField])) * 2;
            return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
        } else {
            if (_0xe16ax10.source.depth == 1) {
                var _0xe16ax40 = level2Radius(Number(_0xe16ax10.target[spendField])) * 2;
                return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
            } else {
                if (_0xe16ax10.source.depth == 2) {
                    var _0xe16ax40 = level3Radius(Number(_0xe16ax10.target[spendField])) * 2;
                    return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
                } else {
                    if (_0xe16ax10.source.depth == 3) {
                        var _0xe16ax40 = level4Radius(Number(_0xe16ax10.target[spendField])) * 2;
                        return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
                    };
                };
            };
        };
    }).style('stroke-opacity', function(_0xe16ax10) {
        var _0xe16ax40 = ((_0xe16ax10.source.depth + 1) / 4.5);
        if (_0xe16ax10.target[spendField] <= 0) {
            _0xe16ax40 = 0.1;
        };
        return _0xe16ax40;
    });
    _0xe16ax43.exit().transition().duration(_0xe16ax3c).attr('d', diagonal).remove();
    _0xe16ax2e.forEach(function(_0xe16ax10) {
        _0xe16ax10.x0 = _0xe16ax10.x;
        _0xe16ax10.y0 = _0xe16ax10.y;
    });

    function _0xe16ax47(_0xe16ax10) {
        toolTip.transition().duration(200).style('opacity', '.9');
        header.text(_0xe16ax10.source_Level1);
        header1.text((_0xe16ax10.depth > 1) ? _0xe16ax10.source_Level2 : '');
        header2.html((_0xe16ax10.depth > 2) ? _0xe16ax10.source_Level3 : '');
        if (_0xe16ax10.depth > 3) {
            header2.html(header2.html() + ' - ' + _0xe16ax10.source_Level4);
        };
        fedSpend.text(formatCurrency(_0xe16ax10.sum_Federal));
        stateSpend.text(formatCurrency(_0xe16ax10.sum_State));
        localSpend.text(formatCurrency(_0xe16ax10.sum_Local));
        toolTip.style('left', (d3.event.pageX + 15) + 'px').style('top', (d3.event.pageY - 75) + 'px');
    };
};

function toggleButton(_0xe16ax49) {
    _0xe16ax49.attr('class', 'selected');
    if (_0xe16ax49 == federalButton) {
        localButton.attr('class', 'unselected');
        stateButton.attr('class', 'unselected');
    } else {
        if (_0xe16ax49 == stateButton) {
            localButton.attr('class', 'unselected');
            federalButton.attr('class', 'unselected');
        } else {
            federalButton.attr('class', 'unselected');
            stateButton.attr('class', 'unselected');
        };
    };
};

function toggle(_0xe16ax10) {
    if (_0xe16ax10.children) {
        _0xe16ax10._children = _0xe16ax10.children;
        _0xe16ax10.children = null;
    } else {
        _0xe16ax10.children = _0xe16ax10._children;
        _0xe16ax10._children = null;
    };
};
"use strict";

var EXPANDED_COLOR = 'lightsteelblue',
    COLLAPSED_COLOR = 'white',
    IMAGE_WIDTH = 20,
    STROKE_MIN = 5,
    STROKE_MAX = 40,
    LAYER_SPACING = 100,
    MIN_IMAGE_WIDTH = 12;

function sortNorm(a, b) {
    return b.weight - a.weight;
}

function sortReverse(a, b) {
    return a.weight - b.weight;
}

function biggestChild(element, reverseSort) {
    var index = reverseSort ? element.children.length-1 : 0;
    return element.children[index];
}

function plot(jsonData, staticItemData, staticChampData, containerSelector, reverseSort) {
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = d3.select(containerSelector).node().getBoundingClientRect().width - margin.right - margin.left,
      height = (LAYER_SPACING * 6) - margin.top - margin.bottom;

    var i = 0,
      duration = 750,
      root;

    var tree = d3.layout.tree()
        .size([width, height])
        .separation(function separation(a, b) {
            return a.parent == b.parent ? 0.125 : 0.25;
        })
        .sort(reverseSort ? sortReverse : sortNorm);

    var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.x, d.y]; });

    var svg = d3.select(containerSelector).append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    root = jsonData;
    root.x0 = width / 2;
    root.y0 = 0;
    root._weight = root.weight;

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    var maxWeight = jsonData.children.reduce(function(largestValue, elem) { return largestValue > elem.weight ? largestValue : elem.weight; }, 0);
    var strokeScale = d3.scale.linear()
        .domain([0, 1])
        .range([STROKE_MIN, STROKE_MAX])
        .clamp(true);
    var widthScale = d3.scale.linear()
        .domain([0, 1])
        .range([STROKE_MIN, STROKE_MIN + ((STROKE_MAX - STROKE_MIN) / 2)])
        .clamp(true);

    root.children.forEach(collapse);
    update(root);
    click(biggestChild(root, reverseSort));

    d3.select(self.frameElement).style('height', '800px');

    function update(source) {
        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        // nodes.forEach(function(d) { d.y = Math.sqrt(d.depth) * LAYER_SPACING; });
        nodes.forEach(function(d) { d.y = d.depth * LAYER_SPACING; });

        // Update the nodes
        var node = svg.selectAll('g.node')
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', function(d) { return 'translate(' + source.x0 + ',' + source.y0 + ')'; })
            .on('click', click);

        // nodeEnter.append('circle')
        //     .on('mouseover', hover.bind(null, true))
        //     .on('mouseout', hover.bind(null, false))
        //     .attr('r', 1e-6)
        //     .style('fill', function(d) { return d._children ? COLLAPSED_COLOR : EXPANDED_COLOR; });

        // nodeEnter.append('text')
        //     .attr('x', function(d) { return widthScale(d.weight); })
        //     .attr('dy', '.35em')
        //     .attr('text-anchor', function(d) { return 'start'; })
        //     .text(function(d) { return d.name; })
        //     .style('fill-opacity', 1e-6);
        nodeEnter.append('image')
            .on('mouseover', hover.bind(null, true))
            .on('mouseout', hover.bind(null, false))
            .attr('x', 1e-6)
            .attr('y', 1e-6)
            .attr('height', 1e-6)
            .attr('width', 1e-6)
            // .style('border-radius', function(d) { return widthScale(d.weight) / 2; })
            .attr('xlink:href', function(d) {
                if (d.itemId)
                    return ('http://ddragon.leagueoflegends.com/cdn/5.15.1/img/item/' + staticItemData.data[d.itemId].image.full);
                else
                    return ('http://ddragon.leagueoflegends.com/cdn/5.15.1/img/champion/' + staticChampData.data[d.champStrKey].image.full);
            });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

        // nodeUpdate.select('circle')
        //     .attr('r', multiScaler.bind(null, false))
        //     .style('fill', function(d) { return d._children ? COLLAPSED_COLOR : EXPANDED_COLOR; });

        nodeUpdate.select('image')
            .attr('x', function(d) { return -1 * Math.max(multiScaler(true, d), MIN_IMAGE_WIDTH) / 2; })
            .attr('y', function(d) { return -1 * Math.max(multiScaler(true, d), MIN_IMAGE_WIDTH) / 2; })
            .attr('height', function(d) { return Math.max(multiScaler(true, d), MIN_IMAGE_WIDTH); })
            .attr('width', function(d) { return Math.max(multiScaler(true, d), MIN_IMAGE_WIDTH); });

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr('transform', function(d) { return 'translate(' + source.x + ',' + source.y + ')'; })
            .remove();

        // nodeExit.select('circle')
        //     .attr('r', 1e-6);
        nodeExit.select('image')
            .attr('width', 1e-6)
            .attr('height', 1e-6);

        // nodeExit.select('text')
        //     .style('fill-opacity', 1e-6);

        // Update the links…
        var link = svg.selectAll('path.link')
            .data(links, function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert('path', 'g')
            // .on('mouseover', hover.bind(null, true))
            // .on('mouseout', hover.bind(null, false))
            .attr('class', 'link')
            .attr('d', function(d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({ source: o, target: o });
            })
            .style('stroke-width', multiScaler.bind(null, true))
            .on('click', click);

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr('d', diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr('d', function(d) {
                var o = {x: source.x, y: source.y};
                return diagonal({ source: o, target: o });
            })
            .remove();


        // Stash the old positions for transition.
        nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
    }

    function multiScaler(isStroke, d) {
        var func = isStroke ? strokeScale : widthScale;
        var element = d.target || d;

        // return modifier * func(element.weight /
        //     (element.parent ?
        //         biggestChild(element.parent, reverseSort).weight :
        //         maxWeight));
        return func(element.weight / maxWeight);
    }

    // Toggle children on click.
    function click(d) {
        var element = d.source || d;
        if (!element.children && element._children.length === 0) { // Trying to expand _collapsed_ node with no children
            alert('' + element.name + ' has no further item purchases');
            return;
        }

        if (element.children) {
            element.weight = element._weight;
            element._weight = null;
            element._children = element.children;
            element.children = null;
        }
        else {
            element._weight = element.weight;
            element.weight = (element.parent ?
                biggestChild(element.parent, reverseSort).weight :
                maxWeight);
            element.children = element._children;
            element._children = null;
        }
        update(element);
    }

    // Show tooltip on hover
    var tooltip = d3.select('#tooltip');
    var tooltipText = d3.select('#tooltip .mdl-card__title-text');
    var tooltipValue = d3.select('#tooltip .mdl-card__subtitle-text');
    function hover(hoverIn, d) {
        if (hoverIn) {
            var value;
            if (d.source) {
                value = d.target._weight ? d.target._weight : d.target.weight;
                tooltipText.text(d.source.name + ' -> ' + d.target.name);
            }
            else {
                value = d._weight ? d._weight : d.weight;
                tooltipText.text(d.name);
            }

            tooltipValue.text('x' + value);

            tooltip.classed('visible', true)
                .style('left', (d3.event.pageX - 165) + 'px')
                .style('top', (d3.event.pageY + 20) + 'px');
        }
        else {
            tooltip.classed('visible', false);
            // tooltip.attr('class', null);
        }
    }
}

if (!(dataBefore && dataAfter)) {
    alert('There doesn\'t seem to be enough data for this champion.');
}
else {
    plot(dataBefore, itemBefore, champBefore, '#before-container', true);
    plot(dataAfter, itemAfter, champBefore, '#after-container', false);
}

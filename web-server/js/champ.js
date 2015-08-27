'use strict';

/*
Script file to display d3, collapsible, Sankey-Diagram-esque trees of item builds for a champion.
*/

// Global constants
var IMAGE_WIDTH         = 20,
    STROKE_MIN          = 5,
    STROKE_MAX          = 40,
    LAYER_SPACING       = 100,
    MIN_IMAGE_WIDTH     = 12,
    TEXT_RELATIVE_SCALE = 0.5,
    lastId              = 0,
    RED                 = '#FF2400',
    ORANGE              = '#F87217',
    YELLOW              = '#FFD801',
    YELLOW_GREEN        = '#B1FB17',
    GREEN               = '#6CC417';

// Functions for sorting in different orderings
function sortNorm(a, b) {
    return b.count - a.count;
}
function sortReverse(a, b) {
    return a.count - b.count;
}

// Grab the biggest child from sorted list, making use of how it was sorted
function biggestChild(element, reverseSort) {
    var index = reverseSort ? element.children.length-1 : 0;
    return element.children[index];
}

// Master function to display the trees
function plot(jsonData, staticItemData, staticChampData, containerSelector, reverseSort) {
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        // Set width based on container
        width = d3.select(containerSelector).node().getBoundingClientRect().width - margin.right - margin.left,
        // Set height based on tree layer spacing
        height = (LAYER_SPACING * 7) - margin.top - margin.bottom;

    var duration = 750,
        root;

    // Create the d3 tree
    var tree = d3.layout.tree()
        .size([width, height])
        .separation(function separation(a, b) {
            return a.parent == b.parent ? 0.125 : 0.25;
        })
        .sort(reverseSort ? sortReverse : sortNorm); // Possibly reverse the children ordering

    var diagonal = d3.svg.diagonal() // Diagonal structure for tree paths/links
      .projection(function(d) { return [d.x, d.y]; });

    // Create SVG
    var svg = d3.select(containerSelector).append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Data
    root = jsonData;
    root.x0 = width / 2;
    root.y0 = 0;

    // Collapses a node
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    // Set a global scaler as the largest tier 1 child
    var maxWeight = root.children.reduce(function(largestValue, elem) { return largestValue > elem.count ? largestValue : elem.count; }, 0);

    // Various useful scaling functions
    var imageSizeScale = d3.scale.linear() // Scales the images based on pick rate
        .domain([0, 1])
        .range([STROKE_MIN, STROKE_MAX])
        .clamp(true);
    var textSizeScale = d3.scale.linear() // Scales the text based on pick rate
        .domain([0, 1])
        .range([STROKE_MIN * 1/TEXT_RELATIVE_SCALE, STROKE_MAX * TEXT_RELATIVE_SCALE])
        .clamp(true);
    var pathColorScale = d3.scale.quantize() // Colors the paths based on win rate
        .domain([0.4, 0.6])
        .range([RED, ORANGE, YELLOW, YELLOW_GREEN, GREEN]);

    // Collapse the tree
    root.children.forEach(collapse);
    // Display the tree
    update(root);
    // Open the biggest child
    var opening = biggestChild(root, reverseSort);
    opening.x0 = root.x0;
    opening.y0 = root.y0;
    click(opening);

    // Updates the tree after changes
    function update(source) {
        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        // nodes.forEach(function(d) { d.y = Math.sqrt(d.depth) * LAYER_SPACING; });
        nodes.forEach(function(d) { d.y = d.depth * LAYER_SPACING; });

        // Update the nodes
        var node = svg.selectAll('g.node')
            .data(nodes, function(d) { return d.id || (d.id = ++lastId); });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', function(d) { return 'translate(' + source.x0 + ',' + source.y0 + ')'; })
            .on('click', click);

        // When a new node enters, append an image
        nodeEnter.append('image')
            .on('mouseover.image', zoomImage.bind(null, true))
            .on('mouseout.image', zoomImage.bind(null, false))
            .on('mouseover.tooltip', toggleTooltip.bind(null, true))
            .on('mouseout.tooltip', toggleTooltip.bind(null, false))
            .attr('id', function(d) { return 'image_' + d.id; })
            .attr('x', 1e-6)
            .attr('y', 1e-6)
            .attr('height', 1e-6)
            .attr('width', 1e-6)
            // .style('border-radius', function(d) { return imageSizeScale(d.count) / 2; })
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

        // When a node is triggered for an update, update the image
        nodeUpdate.select('image')
            .attr('x', function(d) { return -1 * Math.max(multiSizeScaler(d), MIN_IMAGE_WIDTH) / 2; })
            .attr('y', function(d) { return -1 * Math.max(multiSizeScaler(d), MIN_IMAGE_WIDTH) / 2; })
            .attr('height', function(d) { return Math.max(multiSizeScaler(d), MIN_IMAGE_WIDTH); })
            .attr('width', function(d) { return Math.max(multiSizeScaler(d), MIN_IMAGE_WIDTH); });

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr('transform', function(d) { return 'translate(' + source.x + ',' + source.y + ')'; })
            .remove();

        // When nodes are exiting, shrink their images
        nodeExit.select('image')
            .attr('width', 1e-6)
            .attr('height', 1e-6);


        // Update the link nodes
        var linkNode = svg.selectAll('g.linkNode')
            .data(links, function(d) { return d.target.id; });

        // When a new link node enters, insert a 'g' element before all other 'g' elements, so it's drawn first (and behind)
        var linkNodeEnter = linkNode.enter().insert('g', 'g')
            .attr('class', 'linkNode');

        // Enter any new links (paths) at the parent's previous position.
        linkNodeEnter.append('path')
            .attr('class', 'link')
            .attr('d', function(d) {
                var o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            })
            // .style('stroke', function(d) { return LINK_COLOR.darker(Math.ceil(d.winRate * 4)); })
            .style('stroke', function(d) { return multiColorScaler(d, true); })
            .style('stroke-width', function(d) { return imageSizeScale(d.target.count / maxWeight); });

        // Enter any new text at the parent's previous position.
        linkNodeEnter.append('text')
            .attr('x', function(d) { return d.source.x0; })
            .attr('y', function(d) { return d.source.y0; })
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .attr('fill', '#777777')
            .attr('fill-opacity', 1e-6)
            .attr('font-size', function(d) { return multiSizeScaler(d, true); })
            .text(function(d) { return Math.round(100 * (d.target.count / d.target.parent.count)) + '%'; });

        // Upon an update, perform with a transition delay (animation, etc.)
        var linkNodeUpdate = linkNode.transition().duration(duration);

        // Transition links to their new position.
        linkNodeUpdate.select('path.link')
            .attr('d', diagonal);

        // Transition text to their new position.
        linkNodeUpdate.select('text')
            .attr('fill-opacity', null)
            .attr('x', function(d) { return (d.target.x + d.source.x) * 0.5; })
            .attr('y', function(d) { return (d.target.y + d.source.y) * 0.5; });


        // Transition exiting nodes to the parent's new position.
        var linkNodeExit = linkNode.exit().transition().duration(duration)
            .remove();

        // Exiting link nodes bring their paths with, transitioning their position
        linkNodeExit.select('path.link')
            .attr('d', function(d) {
                var o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            });

        // Exiting link nodes kill their text, fading it out
        linkNodeExit.select('text')
            .attr('fill-opacity', 1e-6);

        // Changes without delay
        linkNode.exit().select('text').attr('fill-opacity', 1e-6);


        // Stash the old positions for future transitions.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Multi-purpose scaling function, for paths and such
    function multiColorScaler(d, isPath) {
        var element = d.target || d;
        return pathColorScale(element.winRate);
    }

    // Multi-purpose scaling function, for paths and such
    function multiSizeScaler(d, isText) {
        var func = isText ? textSizeScale : imageSizeScale;
        var element = d.target || d;

        return func((element.scaleSize || element.count) / maxWeight);
    }

    // Toggle children on click.
    function click(d) {
        var element = d.source || d;
        var collapsingNode = !!element.children;

        element.scaleSize =
            (collapsingNode ?
                null :
                ( (element.scaleSize === maxWeight) ?
                    null :
                    maxWeight ));

        if (!collapsingNode && element._children.length === 0) return; // Trying to expand a *collapsed* node with no children

        if (collapsingNode) { // Toggling off
            element._children = element.children;
            element.children = null;
        }
        else { // Toggling on
            element.children = element._children;
            element._children = null;
        }
        update(element);
    }

    // Scale image up on hover
    function zoomImage(hoverIn, d) {
        var image = d3.select('#image_' + (d.target || d).id).transition().duration(duration / 4);
        if (hoverIn) {
            image.attr('x', -STROKE_MAX / 2)
                .attr('y', -STROKE_MAX / 2)
                .attr('width', STROKE_MAX)
                .attr('height', STROKE_MAX);
        }
        else {
            image.attr('x', -1 * Math.max(multiSizeScaler(d), MIN_IMAGE_WIDTH) / 2)
                .attr('y', -1 * Math.max(multiSizeScaler(d), MIN_IMAGE_WIDTH) / 2)
                .attr('width', Math.max(multiSizeScaler(d), MIN_IMAGE_WIDTH))
                .attr('height', Math.max(multiSizeScaler(d), MIN_IMAGE_WIDTH));
        }
    }

    // Show tooltip on hover
    var tooltip = d3.select('#tooltip');
    tooltip.on('click', function() { console.log('two'); if (tooltip.classed('visible')) tooltip.classed('visible', false); }); // Hide the tooltip on click
    var tooltipText = d3.select('#tooltip .mdl-card__title-text');
    var tooltipCount = d3.select('#tooltip #count');
    var tooltipWinRate = d3.select('#tooltip #win-rate');
    function toggleTooltip(hoverIn, d) {
        if (hoverIn) {
            var value = d.count;

            tooltipText.text(d.name);
            tooltipCount.text('pick: ' + value);
            tooltipWinRate.text('won: ' + (d.winRate * 100).toFixed(2) + '%');

            tooltip.classed('visible', true)
                .style('left', (d3.event.pageX - 165) + 'px')
                .style('top', (d3.event.pageY + 30) + 'px');
        }
        else {
            tooltip.classed('visible', false);
        }
    }
}

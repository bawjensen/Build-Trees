// var jsonData = {'name':'Kalista','weight':13,'children':[{'name':'The Bloodthirster','weight':6,'children':[{'name':'Phantom Dancer','weight':1,'children':[{'name':'Runaan\'s Hurricane (Ranged Only)','weight':1,'children':[{'name':'Infinity Edge','weight':1,'children':[{'name':'','weight':0,'children':[]}]}]}]},{'name':'Runaan\'s Hurricane (Ranged Only)','weight':5,'children':[{'name':'Infinity Edge','weight':2,'children':[{'name':'Statikk Shiv','weight':1,'children':[{'name':'','weight':0,'children':[]}]},{'name':'','weight':0,'children':[{'name':'','weight':0,'children':[]}]}]},{'name':'Last Whisper','weight':1,'children':[{'name':'','weight':0,'children':[{'name':'','weight':0,'children':[]}]}]},{'name':'','weight':0,'children':[{'name':'','weight':0,'children':[{'name':'','weight':0,'children':[]}]}]}]}]},{'name':'Runaan\'s Hurricane (Ranged Only)','weight':4,'children':[{'name':'The Bloodthirster','weight':2,'children':[{'name':'Infinity Edge','weight':1,'children':[{'name':'Statikk Shiv','weight':1,'children':[{'name':'','weight':0,'children':[]}]}]},{'name':'','weight':0,'children':[{'name':'','weight':0,'children':[{'name':'','weight':0,'children':[]}]}]}]},{'name':'Blade of the Ruined King','weight':1,'children':[{'name':'','weight':0,'children':[{'name':'','weight':0,'children':[{'name':'','weight':0,'children':[]}]}]}]},{'name':'','weight':0,'children':[{'name':'','weight':0,'children':[{'name':'','weight':0,'children':[{'name':'','weight':0,'children':[]}]}]}]}]},{'name':'Blade of the Ruined King','weight':3,'children':[{'name':'The Bloodthirster','weight':1,'children':[{'name':'\'s Hurricane (Ranged Only)','weight':1,'children':[{'name':'Last Whisper','weight':1,'children':[{'name':'','weight':0,'children':[]}]}]}]},{'name':'Runaan\'s Hurricane (Ranged Only)','weight':2,'children':[{'name':'Last Whisper','weight':1,'children':[{'name':'','weight':0,'children':[{'name':'','weight':0,'children':[]}]}]},{'name':'The Bloodthirster','weight':1,'children':[{'name':'Last Whisper','weight':1,'children':[{'name':'','weight':0,'children':[]}]}]}]}]}]};

var EXPANDED_COLOR = 'lightsteelblue',
    COLLAPSED_COLOR = 'white',
    IMAGE_WIDTH = 20,
    STROKE_MAX = 40,
    LAYER_SPACING = 80;

function plot(jsonData) {

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = (window.innerWidth * 0.4) - margin.right - margin.left,
      height = 1600 - margin.top - margin.bottom;

    var i = 0,
      duration = 750,
      root;

    var tree = d3.layout.tree()
        .size([width, height])
        .separation(function separation(a, b) {
            return a.parent == b.parent ? 0.125 : 0.25;
        })
        .sort(function comparator(a, b) {
            return a.weight - b.weight;
        });

    var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.x, d.y]; });

    var svg = d3.select('body').append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    var strokeScale = d3.scale.sqrt();
    var radiusScale = d3.scale.sqrt();

    root = jsonData;
    root.x0 = width / 2;
    root.y0 = 0;

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    strokeScale.domain([0, jsonData.weight])
        .range([0, STROKE_MAX]);
    radiusScale.domain([0, jsonData.weight])
        .range([0, STROKE_MAX / 2]);

    root.children.forEach(collapse);
    update(root);

    d3.select(self.frameElement).style('height', '800px');

    function update(source) {
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * LAYER_SPACING; });

    // Update the nodes…
    var node = svg.selectAll('g.node')
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', function(d) { return 'translate(' + source.x0 + ',' + source.y0 + ')'; })
        .on('click', click);

    nodeEnter.append('circle')
        .on('mouseover', hover.bind(null, true))
        .on('mouseout', hover.bind(null, false))
        .attr('r', 1e-6)
        .style('fill', function(d) { return d._children ? COLLAPSED_COLOR : EXPANDED_COLOR; });

    // nodeEnter.append('text')
    //     .attr('x', function(d) { return radiusScale(d.weight); })
    //     .attr('dy', '.35em')
    //     .attr('text-anchor', function(d) { return 'start'; })
    //     .text(function(d) { return d.name; })
    //     .style('fill-opacity', 1e-6);
    nodeEnter.append('image')
        .on('mouseover', hover.bind(null, true))
        .on('mouseout', hover.bind(null, false))
        .attr('x', function(d) { return -radiusScale(d.weight); })
        .attr('y', function(d) { return -radiusScale(d.weight); })
        .attr('height', function(d) { return strokeScale(d.weight); })
        .attr('width', function(d) { return strokeScale(d.weight); })
        // .style('border-radius', function(d) { return radiusScale(d.weight) / 2; })
        .attr('xlink:href', function(d) {
            if (d.itemId)
                return ('http://ddragon.leagueoflegends.com/cdn/5.15.1/img/item/' + staticItemData.data[d.itemId].image.full);
            else
                return ('http://ddragon.leagueoflegends.com/cdn/5.15.1/img/champion/' + d.name + '.png');
        });

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    nodeUpdate.select('circle')
        .attr('r', function(d) { return radiusScale(d.weight); })
        .style('fill', function(d) { return d._children ? COLLAPSED_COLOR : EXPANDED_COLOR; });

    nodeUpdate.select('text')
        .style('fill-opacity', 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr('transform', function(d) { return 'translate(' + source.x + ',' + source.y + ')'; })
        .remove();

    nodeExit.select('circle')
        .attr('r', 1e-6);

    nodeExit.select('text')
        .style('fill-opacity', 1e-6);

    // Update the links…
    var link = svg.selectAll('path.link')
        .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', function(d) {
          var o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        })
        .style('stroke-width', function(d) {
          return strokeScale(d.target.weight);
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr('d', diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
          var o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
    }

    // Toggle children on click.
    function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
    }

    var tooltip = d3.select(document.getElementById('tooltip'));
    var tooltipText = d3.select(document.getElementById('title'));
    var tooltipValue = d3.select(document.getElementById('value'));

    // Show tooltip on hover
    function hover(hoverIn, d) {
        if (hoverIn) {
            tooltipText.text(d.name);
            tooltipValue.text(d.weight);

            tooltip.attr('class', 'visible')
                .style('left', (d3.event.pageX + 15) + 'px')
                .style('top', (d3.event.pageY - 75) + 'px');
        }
        else {
            tooltip.attr('class', null);
        }
    }
}

plot(dataBefore);
plot(dataAfter);

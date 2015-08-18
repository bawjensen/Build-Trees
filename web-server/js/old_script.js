// Some setup stuff.
var margin = {top: 1, right: 1, bottom: 6, left: 1};
var width = (window.innerWidth * 0.9) - margin.left - margin.right;
var height = 1750 - margin.top - margin.bottom;
var color = d3.scale.category20();

function drawChart(selector, data) {
  // SVG (group) to draw in.
  var svg = d3.select(selector).append('svg')
          .attr({
            width: width + margin.left + margin.right,
            height: height + margin.top + margin.bottom
          })
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Set up Sankey object.
  var sankey = d3.sankey()
          .nodeWidth(30)
          .nodePadding(15)
          .size([width, height])
          .nodes(data.nodes)
          .links(data.links)
          .layout(32);

  // Path data generator.
  var path = sankey.link();

  // Draw the links.
  var links = svg.append('g').selectAll('.link')
          .data(data.links)
          .enter()
          .append('path')
          .attr({
            'class': 'link',
            d: path
          })
          .style('stroke-width', function (d) {
            return Math.max(1, d.dy);
          })/*
          .sort(function(a, b) { return b.dy - a.dy; })*/;

  links.append('title')
          .text(function (d) {
            return d.source.name + ' -> ' + d.target.name + ': ' + d.value;
          });

  // Draw the nodes.
  var nodes = svg.append('g').selectAll('.node')
          .data(data.nodes)
        .enter().append('g')
          .attr({
            'class': 'node',
            transform: function (d) {
              return 'translate(' + d.x + ',' + d.y + ')';
            }
          })
        .call(d3.behavior.drag()
          .origin(function(d) { return d; })
          .on("dragstart", function() { this.parentNode.appendChild(this); })
          .on("drag", dragmove));

  nodes.append('rect')
          .attr({
            height: function (d) {
              return d.dy;
            },
            width: sankey.nodeWidth()
          })
          .style({
            fill: function (d) {
              return d.color = color(d.name.replace(/ .*/, ''));
            },
            stroke: function (d) {
              return d3.rgb(d.color).darker(2);
            }
          })/*
        .append('title')
          .text(function (d) {
            return d.name;
          })*/;

  // nodes.append('text')
  //         .attr({
  //           x: sankey.nodeWidth() / 2,
  //           y: function (d) {
  //             return d.dy / 2;
  //           },
  //           dy: '.35em',
  //           'text-anchor': 'middle',
  //           transform: null
  //         })
  //         .text(function (d) {
  //           return d.name;
  //         });
  nodes.append('text')
          .attr({
            x: -2,
            y: function(d) { return d.dy / 2; },
            dy: '.35em',
            'text-anchor': 'end',
            transform: null
          })
          .text(function(d) { return d.name; })
        .filter(function(d) { return d.x < width / 2; })
          .attr({
            x: 2 + sankey.nodeWidth(),
            'text-anchor': 'start'
          });
}

function dragmove(d) {
  d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
  sankey.relayout();
  link.attr("d", path);
}

drawChart('#chart-before', dataBefore);
drawChart('#chart-after', dataAfter);

import _ from 'lodash';
import d3 from 'd3';
import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ChampionBuilds.css';

class BuildsVisualization {
  static PATH_STROKE_MIN = 0; // px
  static PATH_STROKE_MAX = 40; // px
  static IMAGE_SIZE_MIN = 20; // px
  static IMAGE_SIZE_MAX = 50; // px
  static TEXT_SIZE_MIN = 10; // px
  // TEXT_SIZE_MAX derived from PATH_STROKE_MAX
  static LAYER_SPACING = 100; // px
  static TEXT_RELATIVE_SCALE = 0.5; // (%)
  static RED = '#FF2400';
  static YELLOW = '#FFFF00';
  static GREEN = '#00AF00';
  static MARGIN = { TOP: 50, RIGHT: 50, BOTTOM: 50, LEFT: 50 }; // px
  static DURATION = 750; // ms

  // scalers enum
  static SCALER_PATH_COLOR = 1;
  static SCALER_PATH_SIZE = 2;
  static SCALER_IMAGE_SIZE = 3;
  static SCALER_TEXT_SIZE = 4;


  static sortNorm(a, b) {
    return b.count - a.count;
  }

  static largestChild(node) {
    return _.maxBy(node.children, 'count');
  }

  static getLargestSiblingCount(treeNode) {
    if (!treeNode.parent) return treeNode.count;
    return _.max(_.map(treeNode.parent.children, 'count'));
  }

  // Collapses a node
  static collapse(node) {
    const newNode = node;

    if (newNode.children) {
      newNode.unusedChildren = newNode.children;
      newNode.unusedChildren = newNode.unusedChildren.map(BuildsVisualization.collapse);
      newNode.children = null;
    }

    return newNode;
  }

  constructor(jsonData, staticChampData, staticItemData, containerEl) {
    // For React's detachRef
    if (containerEl === null) return;

    this.jsonData = jsonData;
    this.staticChampData = staticChampData;
    this.staticItemData = staticItemData;
    this.containerEl = containerEl;

    this.lastId = 0;

    this.diagonalProjection = d3
      .svg
      .diagonal()
      .projection((node) => ([node.x, node.y]));

    this.scalers = {};

    // Colors the paths based on win rate
    this.scalers[BuildsVisualization.SCALER_PATH_COLOR] = d3
      .scale
      .linear()
      .domain([0.4, 0.5, 0.6])
      .range([BuildsVisualization.RED, BuildsVisualization.YELLOW, BuildsVisualization.GREEN])
      .clamp(true);

    // Scales the images based on pick rate
    this.scalers[BuildsVisualization.SCALER_PATH_SIZE] = d3
      .scale
      .linear()
      .domain([0, 1])
      .range([BuildsVisualization.PATH_STROKE_MIN, BuildsVisualization.PATH_STROKE_MAX])
      .clamp(true);

    // Scales the images based on pick rate
    this.scalers[BuildsVisualization.SCALER_IMAGE_SIZE] = d3
      .scale
      .linear()
      .domain([0, 1])
      .range([BuildsVisualization.IMAGE_SIZE_MIN, BuildsVisualization.IMAGE_SIZE_MAX])
      .clamp(true);

    // Scales the text based on pick rate
    this.scalers[BuildsVisualization.SCALER_TEXT_SIZE] = d3
      .scale
      .linear()
      .domain([0, 1])
      .range([
        BuildsVisualization.TEXT_SIZE_MIN,
        BuildsVisualization.PATH_STROKE_MAX * BuildsVisualization.TEXT_RELATIVE_SCALE,
      ])
      .clamp(true);

    // Set width based on container
    const width = d3
      .select(containerEl)
      .node()
      .getBoundingClientRect()
      .width
      - BuildsVisualization.MARGIN.RIGHT
      - BuildsVisualization.MARGIN.LEFT;
      // Set height based on tree layer spacing
    const height = (BuildsVisualization.LAYER_SPACING * 7) -
      BuildsVisualization.MARGIN.TOP -
      BuildsVisualization.MARGIN.BOTTOM;

    // Create the d3 tree
    this.tree = d3.layout.tree()
      .size([width, height])
      .separation((a, b) => (a.parent === b.parent ? 0.125 : 0.25))
      .sort(BuildsVisualization.sortNorm);

    // Create SVG
    this.svg = d3
      .select(containerEl)
      .append('svg')
      .attr('width', width + BuildsVisualization.MARGIN.RIGHT + BuildsVisualization.MARGIN.LEFT)
      .attr('height', height + BuildsVisualization.MARGIN.TOP + BuildsVisualization.MARGIN.BOTTOM)
      .append('g')
      .attr(
        'transform',
        `translate(${BuildsVisualization.MARGIN.LEFT},${BuildsVisualization.MARGIN.TOP})`,
      );

    // Data
    this.root = jsonData;
    this.root.x0 = width / 2;
    this.root.y0 = 0;

    // FIXME(bryan): Figure out how to do this the react way
    this.tooltip = d3.select('#tooltip');
    this.tooltip.on('click', () => {
      if (this.tooltip.classed(s.tooltipContainerIsVisible)) {
        this.tooltip.classed(s.tooltipContainerIsVisible, false);
      }
    });
    this.tooltipText = d3.select('#tooltip .mdl-card__title-text');
    this.tooltipCount = d3.select('#tooltip #count');
    this.tooltipWinRate = d3.select('#tooltip #win-rate');

    this.setupInitialState();
  }

  setupInitialState() {
    // Collapse the tree
    this.root.children = this.root.children.map(BuildsVisualization.collapse);

    // Display the tree
    this.update(this.root);

    // Open the biggest child
    const toOpen = BuildsVisualization.largestChild(this.root);
    toOpen.x0 = this.root.x0;
    toOpen.y0 = this.root.y0;

    this.clickTreeNode(toOpen);
  }

  toggleTooltip(hoverIn, node) {
    if (hoverIn) {
      const value = node.count;

      this.tooltipText.text(node.name);
      this.tooltipCount.text(
        `${value}(${Math.round(100 * (node.count / (node.parent ? node.parent.count : node.count)))}%)`,
      );
      this.tooltipWinRate.text(`won: ${(node.winRate * 100).toFixed(2)}%`);

      this.tooltip.classed(s.tooltipContainerIsVisible, true)
        .style('left', `${(d3.event.pageX - 165)}px`)
        .style('top', `${(d3.event.pageY + 30)}px`);
    } else {
      this.tooltip.classed(s.tooltipContainerIsVisible, false);
    }
  }

  // Multi-purpose scaling function, for paths and such
  multiColorScaler(node) {
    const element = node.target || node;
    return this.scalers[BuildsVisualization.SCALER_PATH_COLOR](element.winRate);
  }

  // Multi-purpose scaling function, for paths and such
  multiSizeScaler(node, type) {
    const scalerFunc = this.scalers[type];
    const targetNode = node.target || node;

    const valueToScale = targetNode.scaleSize
      || targetNode.count / (targetNode.parent ? targetNode.parent.count : targetNode.count);

    // return scalerFunc(valueToScale / BuildsVisualization.getLargestSiblingCount(targetNode));
    return scalerFunc(valueToScale);
  }

  // Scale image up on hover
  zoomImage(hoverIn, node) {
    const image = d3
      .select(`#image_${(node.target || node).id}`)
      .transition()
      .duration(BuildsVisualization.DURATION / 4);

    if (hoverIn) {
      image.attr('x', BuildsVisualization.IMAGE_SIZE_MAX * -0.5)
        .attr('y', BuildsVisualization.IMAGE_SIZE_MAX * -0.5)
        .attr('width', BuildsVisualization.IMAGE_SIZE_MAX)
        .attr('height', BuildsVisualization.IMAGE_SIZE_MAX);
    } else {
      image.attr(
        'x',
        this.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE) * -0.5,
      )
        .attr(
          'y',
          this.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE) * -0.5,
        )
        .attr(
          'width',
          this.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE),
        )
        .attr(
          'height',
          this.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE),
        );
    }
  }

  // Toggle children on click.
  clickTreeNode(node) {
    const element = node.source || node;
    const collapsingNode = !!element.children;

    if (collapsingNode || element.scaleSize === 1) {
      delete element.scaleSize;
    } else {
      element.scaleSize = 1;
    }

    // Trying to expand a *collapsed* node with no children
    if (!collapsingNode && element.unusedChildren.length === 0) return;

    if (collapsingNode) { // Toggling off
      element.unusedChildren = element.children;
      element.children = null;
    } else { // Toggling on
      element.children = element.unusedChildren;
      element.unusedChildren = null;
    }

    this.update(element);
  }

  // Updates the tree after changes
  update(source) {
    // Compute the new tree layout.
    let nodes = this.tree.nodes(this.root);
    const links = this.tree.links(nodes);

    // Normalize for fixed-depth.
    nodes = nodes.map((node) => {
      const newNode = node;
      newNode.y = newNode.depth * BuildsVisualization.LAYER_SPACING;
      return newNode;
    });

    // Update the nodes
    const treeNodes = this.svg.selectAll(`g.${s.treeNodeContainer}`)
      .data(nodes, (oldNode) => {
        if (!oldNode.id) {
          const newNode = oldNode;
          this.lastId += 1;
          newNode.id = this.lastId;
          return newNode.id;
        }

        return oldNode.id;
      });

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = treeNodes
      .enter()
      .append('g')
      .attr('class', s.treeNodeContainer)
      .attr('transform', () => (`translate(${source.x0},${source.y0})`))
      .on('click', this.clickTreeNode.bind(this));

    // When a new node enters, append an image
    nodeEnter.append('image')
      .attr('id', (node) => `image_${node.id}`)
      .attr('x', 1e-6)
      .attr('y', 1e-6)
      .attr('height', 1e-6)
      .attr('width', 1e-6)
      .attr('xlink:href', (node) => {
        if (node.itemId) {
          if (this.staticItemData.data[node.itemId]) {
            return `http://ddragon.leagueoflegends.com/cdn/5.15.1/img/item/${this.staticItemData.data[node.itemId].image.full}`;
          }
          return '';
        }
        return `http://ddragon.leagueoflegends.com/cdn/5.15.1/img/champion/${this.staticChampData.image.full}`;
      });

    if (!navigator.userAgent.match(/iPhone/)) {
      nodeEnter
        .on('mouseover.image', this.zoomImage.bind(this, true))
        .on('mouseout.image', this.zoomImage.bind(this, false))
        .on('mouseover.tooltip', this.toggleTooltip.bind(this, true))
        .on('mouseout.tooltip', this.toggleTooltip.bind(this, false));
    }

    // Transition nodes to their new position.
    const nodeUpdate = treeNodes.transition()
      .duration(BuildsVisualization.DURATION)
      .attr('transform', (node) => `translate(${node.x}, ${node.y})`);

    // When a node is triggered for an update, update the image
    nodeUpdate.select('image')
      .attr(
        'x',
        (node) => this.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE) * -0.5,
      )
      .attr(
        'y',
        (node) => this.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE) * -0.5,
      )
      .attr(
        'height',
        (node) => this.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE),
      )
      .attr(
        'width',
        (node) => this.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE),
      );

    // Transition exiting nodes to the parent's new position.
    const nodeExit = treeNodes
      .exit()
      .transition()
      .duration(BuildsVisualization.DURATION)
      .attr('transform', () => `translate(${source.x}, ${source.y})`)
      .remove();

    // When nodes are exiting, shrink their images
    nodeExit.select('image')
      .attr('width', 1e-6)
      .attr('height', 1e-6)
      .attr('x', 1e-6)
      .attr('y', 1e-6);


    // Update the link nodes
    const linkNode = this.svg
      .selectAll(`g.${s.linkContainer}`)
      .data(links, (node) => node.target.id);

    const linkNodeEnter = linkNode
      .enter();

    // When a new link node enters, insert a 'g' element before all other 'g' elements,
    // so it's drawn first (and behind)
    const linkNodeContents = linkNodeEnter
      .insert('g', 'g')
      .attr('class', s.linkContainer);

    // Enter any new links (paths) at the parent's previous position.
    linkNodeContents.append('path')
      .attr('class', 'link')
      .attr('d', () => {
        const o = { x: source.x0, y: source.y0 };
        return this.diagonalProjection({ source: o, target: o });
      })
      .style('stroke', (node) => this.multiColorScaler(node, true))
      .style('stroke-width', 1e-6);

    // Enter any new text at the parent's previous position.
    linkNodeContents
      .append('text')
      .attr('x', () => source.x0)
      .attr('y', () => source.y0)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill-opacity', 1e-6)
      .attr('font-size', (node) => this.multiSizeScaler(node, BuildsVisualization.SCALER_TEXT_SIZE))
      .text((node) => `${Math.round((node.target.count / node.source.count) * 100)}%`);

    // Upon an update, perform with a transition delay (animation, etc.)
    const linkNodeUpdate = linkNode.transition().duration(BuildsVisualization.DURATION);

    // Transition links to their new position.
    linkNodeUpdate.select('path.link')
      .attr('d', this.diagonalProjection)
      .style(
        'stroke-width',
        (node) => this.scalers[BuildsVisualization.SCALER_PATH_SIZE](
          node.target.count / (node.source ? node.source.count : node.target.count),
        ),
      );

    // Transition text to their new position.
    linkNodeUpdate.select('text')
      .attr('fill-opacity', 1)
      .attr('x', (d) => (d.target.x + d.source.x) * 0.5)
      .attr('y', (d) => (d.target.y + d.source.y) * 0.5);


    // Transition exiting nodes to the parent's new position.
    const linkNodeExitPost = linkNode
      .exit()
      .transition()
      .duration(BuildsVisualization.DURATION)
      .remove();

    linkNodeExitPost
      .select('text')
      .attr('fill-opacity', 1e-6)
      .attr('x', () => source.x)
      .attr('y', () => source.y);

    // Exiting link nodes bring their paths with, transitioning their position
    linkNodeExitPost
      .select('path.link')
      .style('stroke-width', 1e-6)
      .attr('d', () => {
        const o = { x: source.x, y: source.y };
        return this.diagonalProjection({ source: o, target: o });
      });


    // Stash the old positions for future transitions.
    nodes = nodes.map((node) => {
      const newNode = node;
      newNode.x0 = newNode.x;
      newNode.y0 = newNode.y;
      return newNode;
    });
  }
}

class ChampionBuilds extends React.Component {
  static propTypes = {
    builds: PropTypes.object.isRequired,
    champion: PropTypes.object.isRequired,
    items: PropTypes.object.isRequired,
    roleLabel: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col mdl-card mdl-shadow--4dp">
            <h5 className={s.buildsLabel}>
              {`${_.startCase(this.props.roleLabel)} - ${_.startCase(this.props.champion.id)}`}
            </h5>
            <div
              ref={node => {
                this.vis = new BuildsVisualization(
                  this.props.builds,
                  this.props.champion,
                  this.props.items,
                  node,
                );
              }}
            />
          </div>
        </div>
        <div id="tooltip" className={`${s.tooltipContainer} mdl-card mdl-shadow--4dp`}>
          <div className="mdl-card__title">
            <h4 className={`${s.tooltipTitle} mdl-card__title-text`}>
              Tooltip Title
            </h4>
            <div className="mdl-card__subtitle-text">
              <h4 id="count" className={s.tooltipSubTitle}>
                Tooltip Count
              </h4>
              <h4 id="win-rate" className={s.tooltipSubTitle}>
                Tooltip Win Rate
              </h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ChampionBuilds);

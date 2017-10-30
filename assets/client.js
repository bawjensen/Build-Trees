webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  var _typeof2 = __webpack_require__(1);

  var _typeof3 = _interopRequireDefault(_typeof2);

  var _regenerator = __webpack_require__(69);

  var _regenerator2 = _interopRequireDefault(_regenerator);

  var _asyncToGenerator2 = __webpack_require__(73);

  var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

  var _jsxFileName = '/Users/bryanjensen/Desktop/build-trees/src/client.js'; /**
                                                                              * React Starter Kit (https://www.reactstarterkit.com/)
                                                                              *
                                                                              * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
                                                                              *
                                                                              * This source code is licensed under the MIT license found in the
                                                                              * LICENSE.txt file in the root directory of this source tree.
                                                                              */

  // Re-render the app when window.location changes
  var onLocationChange = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(location) {
      var _this = this;

      var _ret;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // Remember the latest scroll position for the previous location
              scrollPositionsHistory[currentLocation.key] = {
                scrollX: window.pageXOffset,
                scrollY: window.pageYOffset
              };
              // Delete stored scroll position for next page if any
              if (_history2.default.action === 'PUSH') {
                delete scrollPositionsHistory[location.key];
              }
              currentLocation = location;

              _context2.prev = 3;
              return _context2.delegateYield(_regenerator2.default.mark(function _callee() {
                var route;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _universalRouter2.default.resolve(routes, {
                          path: location.pathname,
                          query: _queryString2.default.parse(location.search)
                        });

                      case 2:
                        route = _context.sent;

                        if (!(currentLocation.key !== location.key)) {
                          _context.next = 5;
                          break;
                        }

                        return _context.abrupt('return', {
                          v: void 0
                        });

                      case 5:
                        if (!route.redirect) {
                          _context.next = 8;
                          break;
                        }

                        _history2.default.replace(route.redirect);
                        return _context.abrupt('return', {
                          v: void 0
                        });

                      case 8:

                        appInstance = _reactDom2.default.render(_react2.default.createElement(
                          _App2.default,
                          { context: context, __source: {
                              fileName: _jsxFileName,
                              lineNumber: 149
                            },
                            __self: _this
                          },
                          route.component
                        ), container, function () {
                          return onRenderComplete(route, location);
                        });

                      case 9:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              })(), 't0', 5);

            case 5:
              _ret = _context2.t0;

              if (!((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object")) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt('return', _ret.v);

            case 8:
              _context2.next = 21;
              break;

            case 10:
              _context2.prev = 10;
              _context2.t1 = _context2['catch'](3);

              console.error(_context2.t1); // eslint-disable-line no-console

              // Current url has been changed during navigation process, do nothing

              if (!(currentLocation.key !== location.key)) {
                _context2.next = 15;
                break;
              }

              return _context2.abrupt('return');

            case 15:
              if (false) {
                _context2.next = 20;
                break;
              }

              appInstance = null;
              document.title = 'Error: ' + _context2.t1.message;
              _reactDom2.default.render(_react2.default.createElement(_devUtils.ErrorReporter, { error: _context2.t1, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 165
                },
                __self: this
              }), container);
              return _context2.abrupt('return');

            case 20:

              // Avoid broken navigation in production mode by a full page reload on error
              window.location.reload();

            case 21:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[3, 10]]);
    }));

    return function onLocationChange(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  // Handle client-side navigation by using HTML5 History API
  // For more information visit https://github.com/mjackson/history#readme


  __webpack_require__(90);

  var _react = __webpack_require__(385);

  var _react2 = _interopRequireDefault(_react);

  var _reactDom = __webpack_require__(415);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  var _fastclick = __webpack_require__(561);

  var _fastclick2 = _interopRequireDefault(_fastclick);

  var _universalRouter = __webpack_require__(562);

  var _universalRouter2 = _interopRequireDefault(_universalRouter);

  var _queryString = __webpack_require__(583);

  var _queryString2 = _interopRequireDefault(_queryString);

  var _PathUtils = __webpack_require__(585);

  var _history = __webpack_require__(586);

  var _history2 = _interopRequireDefault(_history);

  var _App = __webpack_require__(596);

  var _App2 = _interopRequireDefault(_App);

  var _devUtils = __webpack_require__(612);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // Global (context) variables that can be easily accessed from any React component
  // https://facebook.github.io/react/docs/context.html
  var context = {
    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    insertCss: function insertCss() {
      for (var _len = arguments.length, styles = Array(_len), _key = 0; _key < _len; _key++) {
        styles[_key] = arguments[_key];
      }

      // eslint-disable-next-line no-underscore-dangle
      var removeCss = styles.map(function (x) {
        return x._insertCss();
      });
      return function () {
        removeCss.forEach(function (f) {
          return f();
        });
      };
    }
  };

  function updateTag(tagName, keyName, keyValue, attrName, attrValue) {
    var node = document.head.querySelector(tagName + '[' + keyName + '="' + keyValue + '"]');
    if (node && node.getAttribute(attrName) === attrValue) return;

    // Remove and create a new tag in order to make it work with bookmarks in Safari
    if (node) {
      node.parentNode.removeChild(node);
    }
    if (typeof attrValue === 'string') {
      var nextNode = document.createElement(tagName);
      nextNode.setAttribute(keyName, keyValue);
      nextNode.setAttribute(attrName, attrValue);
      document.head.appendChild(nextNode);
    }
  }
  function updateMeta(name, content) {
    updateTag('meta', 'name', name, 'content', content);
  }
  function updateCustomMeta(property, content) {
    // eslint-disable-line no-unused-vars
    updateTag('meta', 'property', property, 'content', content);
  }
  function updateLink(rel, href) {
    // eslint-disable-line no-unused-vars
    updateTag('link', 'rel', rel, 'href', href);
  }

  // Switch off the native scroll restoration behavior and handle it manually
  // https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
  var scrollPositionsHistory = {};
  if (window.history && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  var onRenderComplete = function initialRenderComplete() {
    var elem = document.getElementById('css');
    if (elem) elem.parentNode.removeChild(elem);
    onRenderComplete = function renderComplete(route, location) {
      document.title = route.title;

      updateMeta('description', route.description);
      // Update necessary tags in <head> at runtime here, ie:
      // updateMeta('keywords', route.keywords);
      // updateCustomMeta('og:url', route.canonicalUrl);
      // updateCustomMeta('og:image', route.imageUrl);
      // updateLink('canonical', route.canonicalUrl);
      // etc.

      var scrollX = 0;
      var scrollY = 0;
      var pos = scrollPositionsHistory[location.key];
      if (pos) {
        scrollX = pos.scrollX;
        scrollY = pos.scrollY;
      } else {
        var targetHash = location.hash.substr(1);
        if (targetHash) {
          var target = document.getElementById(targetHash);
          if (target) {
            scrollY = window.pageYOffset + target.getBoundingClientRect().top;
          }
        }
      }

      // Restore the scroll position if it was saved into the state
      // or scroll to the given #hash anchor
      // or scroll to top of the page
      window.scrollTo(scrollX, scrollY);

      // Google Analytics tracking. Don't send 'pageview' event after
      // the initial rendering, as it was already sent
      if (window.ga) {
        window.ga('send', 'pageview', (0, _PathUtils.createPath)(location));
      }
    };
  };

  // Make taps on links and buttons work fast on mobiles
  _fastclick2.default.attach(document.body);

  var container = document.getElementById('app');
  var appInstance = void 0;
  var currentLocation = _history2.default.location;
  var routes = __webpack_require__(619).default;_history2.default.listen(onLocationChange);
  onLocationChange(currentLocation);

  // Enable Hot Module Replacement (HMR)
  if (false) {
    module.hot.accept('./routes', function () {
      routes = require('./routes').default; // eslint-disable-line global-require

      if (appInstance) {
        try {
          // Force-update the whole tree, including components that refuse to update
          (0, _devUtils.deepForceUpdate)(appInstance);
        } catch (error) {
          appInstance = null;
          document.title = 'Hot Update Error: ' + error.message;
          _reactDom2.default.render(_react2.default.createElement(_devUtils.ErrorReporter, { error: error, __source: {
              fileName: _jsxFileName,
              lineNumber: 191
            },
            __self: undefined
          }), container);
          return;
        }
      }

      onLocationChange(currentLocation);
    });
  }

/***/ },

/***/ 586:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createBrowserHistory = __webpack_require__(587);

  var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // Navigation manager, e.g. history.push('/home')
  // https://github.com/mjackson/history
  exports.default = (true) && (0, _createBrowserHistory2.default)(); /**
                                                                                   * React Starter Kit (https://www.reactstarterkit.com/)
                                                                                   *
                                                                                   * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
                                                                                   *
                                                                                   * This source code is licensed under the MIT license found in the
                                                                                   * LICENSE.txt file in the root directory of this source tree.
                                                                                   */

/***/ },

/***/ 596:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _getPrototypeOf = __webpack_require__(597);

  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

  var _classCallCheck2 = __webpack_require__(601);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass2 = __webpack_require__(602);

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _possibleConstructorReturn2 = __webpack_require__(606);

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits2 = __webpack_require__(607);

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _react = __webpack_require__(385);

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var ContextType = {
    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    insertCss: _react.PropTypes.func.isRequired
  };

  /**
   * The top-level React component setting context (global) variables
   * that can be accessed from all the child components.
   *
   * https://facebook.github.io/react/docs/context.html
   *
   * Usage example:
   *
   *   const context = {
   *     history: createBrowserHistory(),
   *     store: createStore(),
   *   };
   *
   *   ReactDOM.render(
   *     <App context={context}>
   *       <Layout>
   *         <LandingPage />
   *       </Layout>
   *     </App>,
   *     container,
   *   );
   */
  /**
   * React Starter Kit (https://www.reactstarterkit.com/)
   *
   * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

  var App = function (_React$PureComponent) {
    (0, _inherits3.default)(App, _React$PureComponent);

    function App() {
      (0, _classCallCheck3.default)(this, App);
      return (0, _possibleConstructorReturn3.default)(this, (App.__proto__ || (0, _getPrototypeOf2.default)(App)).apply(this, arguments));
    }

    (0, _createClass3.default)(App, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return this.props.context;
      }
    }, {
      key: 'render',
      value: function render() {
        // NOTE: If you need to add or modify header, footer etc. of the app,
        // please do that inside the Layout component.
        return _react2.default.Children.only(this.props.children);
      }
    }]);
    return App;
  }(_react2.default.PureComponent);

  App.propTypes = {
    context: _react.PropTypes.shape(ContextType).isRequired,
    children: _react.PropTypes.element.isRequired
  };
  App.childContextTypes = ContextType;
    exports.default = App;

/***/ },

/***/ 612:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  /**
   * React Starter Kit (https://www.reactstarterkit.com/)
   *
   * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

  /* eslint-disable global-require */

  if (true) {
    module.exports = {
      // The red box (aka red screen of death) component to display your errors
      // https://github.com/commissure/redbox-react
      ErrorReporter: __webpack_require__(613).default,

      // Force-updates React component tree recursively
      // https://github.com/gaearon/react-deep-force-update
      deepForceUpdate: __webpack_require__(618)
    };
    }

/***/ },

/***/ 619:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _regenerator = __webpack_require__(69);

  var _regenerator2 = _interopRequireDefault(_regenerator);

  var _asyncToGenerator2 = __webpack_require__(73);

  var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

  var _home = __webpack_require__(620);

  var _home2 = _interopRequireDefault(_home);

  var _champion = __webpack_require__(657);

  var _champion2 = _interopRequireDefault(_champion);

  var _notFound = __webpack_require__(677);

  var _notFound2 = _interopRequireDefault(_notFound);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // The top-level (parent) route
  exports.default = {

    path: '/',

    // Keep in mind, routes are evaluated in order
    children: [_home2.default,

    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    _champion2.default, _notFound2.default],

    action: function action(_ref) {
      var _this = this;

      var next = _ref.next;
      return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var route;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return next();

              case 2:
                route = _context.sent;


                // Provide default values for title, description etc.
                route.title = route.title || 'Untitled Page';
                route.description = route.description || '';

                return _context.abrupt('return', route);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }))();
    }
  }; /**
      * React Starter Kit (https://www.reactstarterkit.com/)
      *
      * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
      *
      * This source code is licensed under the MIT license found in the
      * LICENSE.txt file in the root directory of this source tree.
      */

/***/ },

/***/ 620:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _regenerator = __webpack_require__(69);

  var _regenerator2 = _interopRequireDefault(_regenerator);

  var _asyncToGenerator2 = __webpack_require__(73);

  var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

  var _jsxFileName = '/Users/bryanjensen/Desktop/build-trees/src/routes/home/index.js';

  var _react = __webpack_require__(385);

  var _react2 = _interopRequireDefault(_react);

  var _Home = __webpack_require__(621);

  var _Home2 = _interopRequireDefault(_Home);

  var _fetch = __webpack_require__(646);

  var _fetch2 = _interopRequireDefault(_fetch);

  var _Layout = __webpack_require__(648);

  var _Layout2 = _interopRequireDefault(_Layout);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = {

    path: '/',

    action: function action() {
      var _this = this;

      return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var resp, data;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _fetch2.default)('/champion.json', {
                  method: 'get',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  }
                });

              case 2:
                resp = _context.sent;
                _context.next = 5;
                return resp.json();

              case 5:
                data = _context.sent;

                if (!(!data || !data.data)) {
                  _context.next = 8;
                  break;
                }

                throw new Error('Failed to load the champion data.');

              case 8:
                return _context.abrupt('return', {
                  title: 'Build Trees',
                  component: _react2.default.createElement(
                    _Layout2.default,
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 25
                      },
                      __self: _this
                    },
                    _react2.default.createElement(_Home2.default, { champions: data.data, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 25
                      },
                      __self: _this
                    })
                  )
                });

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }))();
    }
    };

/***/ },

/***/ 621:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _keys = __webpack_require__(622);

  var _keys2 = _interopRequireDefault(_keys);

  var _getPrototypeOf = __webpack_require__(597);

  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

  var _classCallCheck2 = __webpack_require__(601);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass2 = __webpack_require__(602);

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _possibleConstructorReturn2 = __webpack_require__(606);

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits2 = __webpack_require__(607);

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _jsxFileName = '/Users/bryanjensen/Desktop/build-trees/src/routes/home/Home.js';

  var _react = __webpack_require__(385);

  var _react2 = _interopRequireDefault(_react);

  var _withStyles = __webpack_require__(625);

  var _withStyles2 = _interopRequireDefault(_withStyles);

  var _Home = __webpack_require__(627);

  var _Home2 = _interopRequireDefault(_Home);

  var _ChampionCard = __webpack_require__(640);

  var _ChampionCard2 = _interopRequireDefault(_ChampionCard);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var Home = function (_React$Component) {
    (0, _inherits3.default)(Home, _React$Component);

    function Home() {
      (0, _classCallCheck3.default)(this, Home);
      return (0, _possibleConstructorReturn3.default)(this, (Home.__proto__ || (0, _getPrototypeOf2.default)(Home)).apply(this, arguments));
    }

    (0, _createClass3.default)(Home, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        return _react2.default.createElement(
          'div',
          { className: 'mdl-grid', __source: {
              fileName: _jsxFileName,
              lineNumber: 15
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: _Home2.default.welcome + ' mdl-cell mdl-cell--12-col', __source: {
                fileName: _jsxFileName,
                lineNumber: 16
              },
              __self: this
            },
            _react2.default.createElement(
              'h1',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 17
                },
                __self: this
              },
              'Welcome!'
            ),
            _react2.default.createElement(
              'h6',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 18
                },
                __self: this
              },
              'This site is all about League of Legends champions and the build paths they can take.'
            )
          ),
          (0, _keys2.default)(this.props.champions).map(function (key) {
            return _react2.default.createElement(
              'div',
              { key: key, className: 'mdl-cell mdl-cell--1-col', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 23
                },
                __self: _this2
              },
              _react2.default.createElement(_ChampionCard2.default, { champion: _this2.props.champions[key], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 24
                },
                __self: _this2
              })
            );
          })
        );
      }
    }]);
    return Home;
  }(_react2.default.Component);

  Home.propTypes = {
    champions: _react.PropTypes.objectOf(_react.PropTypes.shape({
      name: _react.PropTypes.string.isRequired
    })).isRequired
  };
    exports.default = (0, _withStyles2.default)(_Home2.default)(Home);

/***/ },

/***/ 627:
/***/ function(module, exports, __webpack_require__) {

  
      var content = __webpack_require__(628);
      var insertCss = __webpack_require__(630);

      if (typeof content === 'string') {
        content = [[module.id, content, '']];
      }

      module.exports = content.locals || {};
      module.exports._getContent = function() { return content; };
      module.exports._getCss = function() { return content.toString(); };
      module.exports._insertCss = function(options) { return insertCss(content, options) };
      
      // Hot Module Replacement
      // https://webpack.github.io/docs/hot-module-replacement
      // Only activated in browser context
      if (false) {
        var removeCss = function() {};
        module.hot.accept("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./Home.css", function() {
          content = require("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./Home.css");

          if (typeof content === 'string') {
            content = [[module.id, content, '']];
          }

          removeCss = insertCss(content, { replace: true });
        });
        module.hot.dispose(function() { removeCss(); });
      }
    

/***/ },

/***/ 628:
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(629)();
  // imports


  // module
  exports.push([module.id, ".Home-welcome-3ej0y {\n  text-align: center;\n  color: white;\n}\n", "", {"version":3,"sources":["/./routes/home/Home.css"],"names":[],"mappings":"AAAA;EACE,mBAAmB;EACnB,aAAa;CACd","file":"Home.css","sourcesContent":[".welcome {\n  text-align: center;\n  color: white;\n}\n"],"sourceRoot":"webpack://"}]);

  // exports
  exports.locals = {
  	"welcome": "Home-welcome-3ej0y"
  };

/***/ },

/***/ 640:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _getPrototypeOf = __webpack_require__(597);

  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

  var _classCallCheck2 = __webpack_require__(601);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass2 = __webpack_require__(602);

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _possibleConstructorReturn2 = __webpack_require__(606);

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits2 = __webpack_require__(607);

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _jsxFileName = '/Users/bryanjensen/Desktop/build-trees/src/components/ChampionCard/ChampionCard.js';

  var _react = __webpack_require__(385);

  var _react2 = _interopRequireDefault(_react);

  var _withStyles = __webpack_require__(625);

  var _withStyles2 = _interopRequireDefault(_withStyles);

  var _ChampionCard = __webpack_require__(641);

  var _ChampionCard2 = _interopRequireDefault(_ChampionCard);

  var _Link = __webpack_require__(643);

  var _Link2 = _interopRequireDefault(_Link);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var ChampionCard = function (_React$Component) {
    (0, _inherits3.default)(ChampionCard, _React$Component);

    function ChampionCard() {
      (0, _classCallCheck3.default)(this, ChampionCard);
      return (0, _possibleConstructorReturn3.default)(this, (ChampionCard.__proto__ || (0, _getPrototypeOf2.default)(ChampionCard)).apply(this, arguments));
    }

    (0, _createClass3.default)(ChampionCard, [{
      key: 'render',
      value: function render() {
        return _react2.default.createElement(
          _Link2.default,
          { className: _ChampionCard2.default.card + ' mdl-card mdl-shadow--4dp', to: '/c/' + this.props.champion.name, __source: {
              fileName: _jsxFileName,
              lineNumber: 18
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: 'mdl-card__media', __source: {
                fileName: _jsxFileName,
                lineNumber: 19
              },
              __self: this
            },
            _react2.default.createElement('img', {
              className: _ChampionCard2.default.champImage,
              src: 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/' + this.props.champion.image.full,
              alt: this.props.champion.name,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 20
              },
              __self: this
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'mdl-card__actions', __source: {
                fileName: _jsxFileName,
                lineNumber: 26
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: _ChampionCard2.default.nameButton + ' mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 27
                },
                __self: this
              },
              this.props.champion.name
            )
          )
        );
      }
    }]);
    return ChampionCard;
  }(_react2.default.Component);

  ChampionCard.propTypes = {
    champion: _react.PropTypes.shape({
      name: _react.PropTypes.string.isRequired,
      image: _react.PropTypes.shape({
        full: _react.PropTypes.string.isRequired
      })
    }).isRequired
  };
    exports.default = (0, _withStyles2.default)(_ChampionCard2.default)(ChampionCard);

/***/ },

/***/ 641:
/***/ function(module, exports, __webpack_require__) {

  
      var content = __webpack_require__(642);
      var insertCss = __webpack_require__(630);

      if (typeof content === 'string') {
        content = [[module.id, content, '']];
      }

      module.exports = content.locals || {};
      module.exports._getContent = function() { return content; };
      module.exports._getCss = function() { return content.toString(); };
      module.exports._insertCss = function(options) { return insertCss(content, options) };
      
      // Hot Module Replacement
      // https://webpack.github.io/docs/hot-module-replacement
      // Only activated in browser context
      if (false) {
        var removeCss = function() {};
        module.hot.accept("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./ChampionCard.css", function() {
          content = require("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./ChampionCard.css");

          if (typeof content === 'string') {
            content = [[module.id, content, '']];
          }

          removeCss = insertCss(content, { replace: true });
        });
        module.hot.dispose(function() { removeCss(); });
      }
    

/***/ },

/***/ 642:
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(629)();
  // imports


  // module
  exports.push([module.id, ".ChampionCard-card-3m_uH {\n  text-align: center;\n  white-space: nowrap;\n  width: 100%;\n  min-height: auto;\n}\n\n.ChampionCard-champImage-qCQxV {\n  width: 100%;\n}\n\n.ChampionCard-nameButton-3_Qiq {\n  width: 100%;\n  min-width: 0;\n  padding: 0;\n  text-overflow: ellipsis;\n}\n", "", {"version":3,"sources":["/./components/ChampionCard/ChampionCard.css"],"names":[],"mappings":"AAAA;EACE,mBAAmB;EACnB,oBAAoB;EACpB,YAAY;EACZ,iBAAiB;CAClB;;AAED;EACE,YAAY;CACb;;AAED;EACE,YAAY;EACZ,aAAa;EACb,WAAW;EACX,wBAAwB;CACzB","file":"ChampionCard.css","sourcesContent":[".card {\n  text-align: center;\n  white-space: nowrap;\n  width: 100%;\n  min-height: auto;\n}\n\n.champImage {\n  width: 100%;\n}\n\n.nameButton {\n  width: 100%;\n  min-width: 0;\n  padding: 0;\n  text-overflow: ellipsis;\n}\n"],"sourceRoot":"webpack://"}]);

  // exports
  exports.locals = {
  	"card": "ChampionCard-card-3m_uH",
  	"champImage": "ChampionCard-champImage-qCQxV",
  	"nameButton": "ChampionCard-nameButton-3_Qiq"
  };

/***/ },

/***/ 643:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _extends2 = __webpack_require__(644);

  var _extends3 = _interopRequireDefault(_extends2);

  var _objectWithoutProperties2 = __webpack_require__(645);

  var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

  var _getPrototypeOf = __webpack_require__(597);

  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

  var _classCallCheck2 = __webpack_require__(601);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass2 = __webpack_require__(602);

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _possibleConstructorReturn2 = __webpack_require__(606);

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits2 = __webpack_require__(607);

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _jsxFileName = '/Users/bryanjensen/Desktop/build-trees/src/components/Link/Link.js';

  var _react = __webpack_require__(385);

  var _react2 = _interopRequireDefault(_react);

  var _history = __webpack_require__(586);

  var _history2 = _interopRequireDefault(_history);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function isLeftClickEvent(event) {
    return event.button === 0;
  }

  function isModifiedEvent(event) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
  }

  var Link = function (_React$Component) {
    (0, _inherits3.default)(Link, _React$Component);

    function Link() {
      var _ref;

      var _temp, _this, _ret;

      (0, _classCallCheck3.default)(this, Link);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Link.__proto__ || (0, _getPrototypeOf2.default)(Link)).call.apply(_ref, [this].concat(args))), _this), _this.handleClick = function (event) {
        if (_this.props.onClick) {
          _this.props.onClick(event);
        }

        if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
          return;
        }

        if (event.defaultPrevented === true) {
          return;
        }

        event.preventDefault();
        _history2.default.push(_this.props.to);
      }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(Link, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        componentHandler.upgradeElement(this.node); // eslint-disable-line no-undef
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props,
            to = _props.to,
            children = _props.children,
            props = (0, _objectWithoutProperties3.default)(_props, ['to', 'children']);

        return _react2.default.createElement(
          'a',
          (0, _extends3.default)({
            ref: function ref(node) {
              _this2.node = node;
            },
            href: to
          }, props, {
            onClick: this.handleClick,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 43
            },
            __self: this
          }),
          children
        );
      }
    }]);
    return Link;
  }(_react2.default.Component);

  Link.propTypes = {
    to: _react.PropTypes.string.isRequired,
    children: _react.PropTypes.node,
    onClick: _react.PropTypes.func
  };
    exports.default = Link;

/***/ },

/***/ 646:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Response = exports.Request = exports.Headers = undefined;

  __webpack_require__(647);

  exports.default = self.fetch.bind(self); /**
                                            * React Starter Kit (https://www.reactstarterkit.com/)
                                            *
                                            * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
                                            *
                                            * This source code is licensed under the MIT license found in the
                                            * LICENSE.txt file in the root directory of this source tree.
                                            */

  var Headers = exports.Headers = self.Headers;
  var Request = exports.Request = self.Request;
  var Response = exports.Response = self.Response;

/***/ },

/***/ 648:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _getPrototypeOf = __webpack_require__(597);

  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

  var _classCallCheck2 = __webpack_require__(601);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass2 = __webpack_require__(602);

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _possibleConstructorReturn2 = __webpack_require__(606);

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits2 = __webpack_require__(607);

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _jsxFileName = '/Users/bryanjensen/Desktop/build-trees/src/components/Layout/Layout.js'; /**
                                                                                                * React Starter Kit (https://www.reactstarterkit.com/)
                                                                                                *
                                                                                                * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
                                                                                                *
                                                                                                * This source code is licensed under the MIT license found in the
                                                                                                * LICENSE.txt file in the root directory of this source tree.
                                                                                                */

  var _react = __webpack_require__(385);

  var _react2 = _interopRequireDefault(_react);

  var _withStyles = __webpack_require__(625);

  var _withStyles2 = _interopRequireDefault(_withStyles);

  var _Layout = __webpack_require__(649);

  var _Layout2 = _interopRequireDefault(_Layout);

  var _Header = __webpack_require__(651);

  var _Header2 = _interopRequireDefault(_Header);

  var _Footer = __webpack_require__(654);

  var _Footer2 = _interopRequireDefault(_Footer);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var Layout = function (_React$Component) {
    (0, _inherits3.default)(Layout, _React$Component);

    function Layout() {
      (0, _classCallCheck3.default)(this, Layout);
      return (0, _possibleConstructorReturn3.default)(this, (Layout.__proto__ || (0, _getPrototypeOf2.default)(Layout)).apply(this, arguments));
    }

    (0, _createClass3.default)(Layout, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        componentHandler.upgradeElement(this.node); // eslint-disable-line no-undef
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var containerClass = _Layout2.default.container + ' mdl-layout mdl-js-layout';

        return _react2.default.createElement(
          'div',
          {
            className: containerClass,
            ref: function ref(node) {
              _this2.node = node;
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 29
            },
            __self: this
          },
          _react2.default.createElement(_Header2.default, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 33
            },
            __self: this
          }),
          _react2.default.createElement(
            'main',
            { className: 'mdl-layout__content', __source: {
                fileName: _jsxFileName,
                lineNumber: 34
              },
              __self: this
            },
            this.props.children,
            _react2.default.createElement(_Footer2.default, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 37
              },
              __self: this
            })
          )
        );
      }
    }]);
    return Layout;
  }(_react2.default.Component);

  Layout.propTypes = {
    children: _react.PropTypes.node.isRequired
  };
    exports.default = (0, _withStyles2.default)(_Layout2.default)(Layout);

/***/ },

/***/ 649:
/***/ function(module, exports, __webpack_require__) {

  
      var content = __webpack_require__(650);
      var insertCss = __webpack_require__(630);

      if (typeof content === 'string') {
        content = [[module.id, content, '']];
      }

      module.exports = content.locals || {};
      module.exports._getContent = function() { return content; };
      module.exports._getCss = function() { return content.toString(); };
      module.exports._insertCss = function(options) { return insertCss(content, options) };
      
      // Hot Module Replacement
      // https://webpack.github.io/docs/hot-module-replacement
      // Only activated in browser context
      if (false) {
        var removeCss = function() {};
        module.hot.accept("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./Layout.css", function() {
          content = require("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./Layout.css");

          if (typeof content === 'string') {
            content = [[module.id, content, '']];
          }

          removeCss = insertCss(content, { replace: true });
        });
        module.hot.dispose(function() { removeCss(); });
      }
    

/***/ },

/***/ 650:
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(629)();
  // imports


  // module
  exports.push([module.id, "/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n:root {\n\n  /*\n   * Typography\n   * ======================================================================== */\n\n  /*\n   * Layout\n   * ======================================================================== */\n\n  /*\n   * Media queries breakpoints\n   * ======================================================================== */\n\n  /* Extra small screen / phone */\n\n  /* Small screen / tablet */\n\n  /* Medium screen / desktop */\n\n  /* Large screen / wide desktop */\n}\n\n/*\n * Base styles\n * ========================================================================== */\n\nhtml {\n  color: #222;\n  font-weight: 100;\n  font-size: 1em; /* ~16px; */\n  font-family: 'Segoe UI', 'HelveticaNeue-Light', sans-serif;\n  line-height: 1.375; /* ~22px */\n}\n\n.Layout-container-1pk24 {\n  background: url('http://riot-web-static.s3.amazonaws.com/images/news/June_2014/SRDB3/srdb3-1.jpg') center / cover;\n}\n\n/*\n * Remove text-shadow in selection highlight:\n * https://twitter.com/miketaylr/status/12228805301\n *\n * These selection rule sets have to be separate.\n * Customize the background color to match your design.\n */\n\n::-moz-selection {\n  background: #b3d4fc;\n  text-shadow: none;\n}\n\n::selection {\n  background: #b3d4fc;\n  text-shadow: none;\n}\n\n/*\n * Remove the gap between audio, canvas, iframes,\n * images, videos and the bottom of their containers:\n * https://github.com/h5bp/html5-boilerplate/issues/440\n */\n\naudio,\ncanvas,\niframe,\nimg,\nsvg,\nvideo {\n  vertical-align: middle;\n}\n\n/*\n * Remove default fieldset styles.\n */\n\nfieldset {\n  border: 0;\n  margin: 0;\n  padding: 0;\n}\n\n/*\n * Allow only vertical resizing of textareas.\n */\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n * Browser upgrade prompt\n * ========================================================================== */\n\n.browserupgrade {\n  margin: 0.2em 0;\n  background: #ccc;\n  color: #000;\n  padding: 0.2em 0;\n}\n\n/*\n * Print styles\n * Inlined to avoid the additional HTTP request:\n * http://www.phpied.com/delay-loading-your-print-css/\n * ========================================================================== */\n\n@media print {\n  *,\n  *::before,\n  *::after {\n    background: transparent !important;\n    color: #000 !important; /* Black prints faster: http://www.sanbeiji.com/archives/953 */\n    box-shadow: none !important;\n    text-shadow: none !important;\n  }\n\n  a,\n  a:visited {\n    text-decoration: underline;\n  }\n\n  a[href]::after {\n    content: ' (' attr(href) ')';\n  }\n\n  abbr[title]::after {\n    content: ' (' attr(title) ')';\n  }\n\n  /*\n   * Don't show links that are fragment identifiers,\n   * or use the `javascript:` pseudo protocol\n   */\n\n  a[href^='#']::after,\n  a[href^='javascript:']::after {\n    content: '';\n  }\n\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid;\n  }\n\n  /*\n   * Printing Tables:\n   * http://css-discuss.incutio.com/wiki/Printing_Tables\n   */\n\n  thead {\n    display: table-header-group;\n  }\n\n  tr,\n  img {\n    page-break-inside: avoid;\n  }\n\n  img {\n    max-width: 100% !important;\n  }\n\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3;\n  }\n\n  h2,\n  h3 {\n    page-break-after: avoid;\n  }\n}\n", "", {"version":3,"sources":["/./components/variables.css","/./components/Layout/Layout.css"],"names":[],"mappings":"AAAA;;;;;;;GAOG;;AAEH;;EACE;;gFAE8E;;EAI9E;;gFAE8E;;EAI9E;;gFAE8E;;EAErD,gCAAgC;;EAChC,2BAA2B;;EAC3B,6BAA6B;;EAC7B,iCAAiC;CAC3D;;AC5BD;;gFAEgF;;AAEhF;EACE,YAAY;EACZ,iBAAiB;EACjB,eAAe,CAAC,YAAY;EAC5B,2DAAqC;EACrC,mBAAmB,CAAC,WAAW;CAChC;;AAED;EACE,kHAAkH;CACnH;;AAED;;;;;;GAMG;;AAEH;EACE,oBAAoB;EACpB,kBAAkB;CACnB;;AAED;EACE,oBAAoB;EACpB,kBAAkB;CACnB;;AAED;;;;GAIG;;AAEH;;;;;;EAME,uBAAuB;CACxB;;AAED;;GAEG;;AAEH;EACE,UAAU;EACV,UAAU;EACV,WAAW;CACZ;;AAED;;GAEG;;AAEH;EACE,iBAAiB;CAClB;;AAED;;gFAEgF;;AAEhF;EACE,gBAAgB;EAChB,iBAAiB;EACjB,YAAY;EACZ,iBAAiB;CAClB;;AAED;;;;gFAIgF;;AAEhF;EACE;;;IAGE,mCAAmC;IACnC,uBAAuB,CAAC,+DAA+D;IACvF,4BAA4B;IAC5B,6BAA6B;GAC9B;;EAED;;IAEE,2BAA2B;GAC5B;;EAED;IACE,6BAA6B;GAC9B;;EAED;IACE,8BAA8B;GAC/B;;EAED;;;KAGG;;EAEH;;IAEE,YAAY;GACb;;EAED;;IAEE,uBAAuB;IACvB,yBAAyB;GAC1B;;EAED;;;KAGG;;EAEH;IACE,4BAA4B;GAC7B;;EAED;;IAEE,yBAAyB;GAC1B;;EAED;IACE,2BAA2B;GAC5B;;EAED;;;IAGE,WAAW;IACX,UAAU;GACX;;EAED;;IAEE,wBAAwB;GACzB;CACF","file":"Layout.css","sourcesContent":["/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n:root {\n  /*\n   * Typography\n   * ======================================================================== */\n\n  --font-family-base: 'Segoe UI', 'HelveticaNeue-Light', sans-serif;\n\n  /*\n   * Layout\n   * ======================================================================== */\n\n  --max-content-width: 1000px;\n\n  /*\n   * Media queries breakpoints\n   * ======================================================================== */\n\n  --screen-xs-min: 480px;  /* Extra small screen / phone */\n  --screen-sm-min: 768px;  /* Small screen / tablet */\n  --screen-md-min: 992px;  /* Medium screen / desktop */\n  --screen-lg-min: 1200px; /* Large screen / wide desktop */\n}\n","@import '../variables.css';\n\n/*\n * Base styles\n * ========================================================================== */\n\nhtml {\n  color: #222;\n  font-weight: 100;\n  font-size: 1em; /* ~16px; */\n  font-family: var(--font-family-base);\n  line-height: 1.375; /* ~22px */\n}\n\n.container {\n  background: url('http://riot-web-static.s3.amazonaws.com/images/news/June_2014/SRDB3/srdb3-1.jpg') center / cover;\n}\n\n/*\n * Remove text-shadow in selection highlight:\n * https://twitter.com/miketaylr/status/12228805301\n *\n * These selection rule sets have to be separate.\n * Customize the background color to match your design.\n */\n\n::-moz-selection {\n  background: #b3d4fc;\n  text-shadow: none;\n}\n\n::selection {\n  background: #b3d4fc;\n  text-shadow: none;\n}\n\n/*\n * Remove the gap between audio, canvas, iframes,\n * images, videos and the bottom of their containers:\n * https://github.com/h5bp/html5-boilerplate/issues/440\n */\n\naudio,\ncanvas,\niframe,\nimg,\nsvg,\nvideo {\n  vertical-align: middle;\n}\n\n/*\n * Remove default fieldset styles.\n */\n\nfieldset {\n  border: 0;\n  margin: 0;\n  padding: 0;\n}\n\n/*\n * Allow only vertical resizing of textareas.\n */\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n * Browser upgrade prompt\n * ========================================================================== */\n\n:global(.browserupgrade) {\n  margin: 0.2em 0;\n  background: #ccc;\n  color: #000;\n  padding: 0.2em 0;\n}\n\n/*\n * Print styles\n * Inlined to avoid the additional HTTP request:\n * http://www.phpied.com/delay-loading-your-print-css/\n * ========================================================================== */\n\n@media print {\n  *,\n  *::before,\n  *::after {\n    background: transparent !important;\n    color: #000 !important; /* Black prints faster: http://www.sanbeiji.com/archives/953 */\n    box-shadow: none !important;\n    text-shadow: none !important;\n  }\n\n  a,\n  a:visited {\n    text-decoration: underline;\n  }\n\n  a[href]::after {\n    content: ' (' attr(href) ')';\n  }\n\n  abbr[title]::after {\n    content: ' (' attr(title) ')';\n  }\n\n  /*\n   * Don't show links that are fragment identifiers,\n   * or use the `javascript:` pseudo protocol\n   */\n\n  a[href^='#']::after,\n  a[href^='javascript:']::after {\n    content: '';\n  }\n\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid;\n  }\n\n  /*\n   * Printing Tables:\n   * http://css-discuss.incutio.com/wiki/Printing_Tables\n   */\n\n  thead {\n    display: table-header-group;\n  }\n\n  tr,\n  img {\n    page-break-inside: avoid;\n  }\n\n  img {\n    max-width: 100% !important;\n  }\n\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3;\n  }\n\n  h2,\n  h3 {\n    page-break-after: avoid;\n  }\n}\n"],"sourceRoot":"webpack://"}]);

  // exports
  exports.locals = {
  	"container": "Layout-container-1pk24"
  };

/***/ },

/***/ 651:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _getPrototypeOf = __webpack_require__(597);

  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

  var _classCallCheck2 = __webpack_require__(601);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass2 = __webpack_require__(602);

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _possibleConstructorReturn2 = __webpack_require__(606);

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits2 = __webpack_require__(607);

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _jsxFileName = '/Users/bryanjensen/Desktop/build-trees/src/components/Header/Header.js';

  var _react = __webpack_require__(385);

  var _react2 = _interopRequireDefault(_react);

  var _withStyles = __webpack_require__(625);

  var _withStyles2 = _interopRequireDefault(_withStyles);

  var _Header = __webpack_require__(652);

  var _Header2 = _interopRequireDefault(_Header);

  var _Link = __webpack_require__(643);

  var _Link2 = _interopRequireDefault(_Link);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var Header = function (_React$Component) {
    (0, _inherits3.default)(Header, _React$Component);

    function Header() {
      (0, _classCallCheck3.default)(this, Header);
      return (0, _possibleConstructorReturn3.default)(this, (Header.__proto__ || (0, _getPrototypeOf2.default)(Header)).apply(this, arguments));
    }

    (0, _createClass3.default)(Header, [{
      key: 'render',
      value: function render() {
        return _react2.default.createElement(
          'header',
          { className: _Header2.default.root, __source: {
              fileName: _jsxFileName,
              lineNumber: 9
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: 'mdl-grid', __source: {
                fileName: _jsxFileName,
                lineNumber: 10
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { className: 'mdl-cell mdl-cell--12-col', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 11
                },
                __self: this
              },
              _react2.default.createElement(
                'span',
                { className: 'mdl-layout__title', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 12
                  },
                  __self: this
                },
                _react2.default.createElement(
                  _Link2.default,
                  { className: 'mdl-button mdl-js-button mdl-button--colored mdl-button--raised mdl-js-ripple-effect', to: '/', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 13
                    },
                    __self: this
                  },
                  'Build Trees'
                )
              )
            )
          )
        );
      }
    }]);
    return Header;
  }(_react2.default.Component);

    exports.default = (0, _withStyles2.default)(_Header2.default)(Header);

/***/ },

/***/ 652:
/***/ function(module, exports, __webpack_require__) {

  
      var content = __webpack_require__(653);
      var insertCss = __webpack_require__(630);

      if (typeof content === 'string') {
        content = [[module.id, content, '']];
      }

      module.exports = content.locals || {};
      module.exports._getContent = function() { return content; };
      module.exports._getCss = function() { return content.toString(); };
      module.exports._insertCss = function(options) { return insertCss(content, options) };
      
      // Hot Module Replacement
      // https://webpack.github.io/docs/hot-module-replacement
      // Only activated in browser context
      if (false) {
        var removeCss = function() {};
        module.hot.accept("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./Header.css", function() {
          content = require("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./Header.css");

          if (typeof content === 'string') {
            content = [[module.id, content, '']];
          }

          removeCss = insertCss(content, { replace: true });
        });
        module.hot.dispose(function() { removeCss(); });
      }
    

/***/ },

/***/ 653:
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(629)();
  // imports


  // module
  exports.push([module.id, ".Header-root-3Gi4A {\n  height: 60px;\n  -webkit-flex-shrink: 0;\n      -ms-flex-negative: 0;\n          flex-shrink: 0;\n}\n", "", {"version":3,"sources":["/./components/Header/Header.css"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,uBAAe;MAAf,qBAAe;UAAf,eAAe;CAChB","file":"Header.css","sourcesContent":[".root {\n  height: 60px;\n  flex-shrink: 0;\n}\n"],"sourceRoot":"webpack://"}]);

  // exports
  exports.locals = {
  	"root": "Header-root-3Gi4A"
  };

/***/ },

/***/ 654:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _getPrototypeOf = __webpack_require__(597);

  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

  var _classCallCheck2 = __webpack_require__(601);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass2 = __webpack_require__(602);

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _possibleConstructorReturn2 = __webpack_require__(606);

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits2 = __webpack_require__(607);

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _jsxFileName = '/Users/bryanjensen/Desktop/build-trees/src/components/Footer/Footer.js'; /**
                                                                                                * React Starter Kit (https://www.reactstarterkit.com/)
                                                                                                *
                                                                                                * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
                                                                                                *
                                                                                                * This source code is licensed under the MIT license found in the
                                                                                                * LICENSE.txt file in the root directory of this source tree.
                                                                                                */

  var _react = __webpack_require__(385);

  var _react2 = _interopRequireDefault(_react);

  var _withStyles = __webpack_require__(625);

  var _withStyles2 = _interopRequireDefault(_withStyles);

  var _Footer = __webpack_require__(655);

  var _Footer2 = _interopRequireDefault(_Footer);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var Footer = function (_React$Component) {
    (0, _inherits3.default)(Footer, _React$Component);

    function Footer() {
      (0, _classCallCheck3.default)(this, Footer);
      return (0, _possibleConstructorReturn3.default)(this, (Footer.__proto__ || (0, _getPrototypeOf2.default)(Footer)).apply(this, arguments));
    }

    (0, _createClass3.default)(Footer, [{
      key: 'render',
      value: function render() {
        var rootClasses = _Footer2.default.root + ' mdl-mini-footer';

        return _react2.default.createElement(
          'footer',
          { className: rootClasses, __source: {
              fileName: _jsxFileName,
              lineNumber: 19
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: 'mdl-mini-footer__left-section', __source: {
                fileName: _jsxFileName,
                lineNumber: 20
              },
              __self: this
            },
            _react2.default.createElement(
              'p',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 21
                },
                __self: this
              },
              'Build Trees isn\'t endorsed by Riot Games and doesn\'t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends \xA9 Riot Games, Inc.'
            )
          )
        );
      }
    }]);
    return Footer;
  }(_react2.default.Component);

    exports.default = (0, _withStyles2.default)(_Footer2.default)(Footer);

/***/ },

/***/ 655:
/***/ function(module, exports, __webpack_require__) {

  
      var content = __webpack_require__(656);
      var insertCss = __webpack_require__(630);

      if (typeof content === 'string') {
        content = [[module.id, content, '']];
      }

      module.exports = content.locals || {};
      module.exports._getContent = function() { return content; };
      module.exports._getCss = function() { return content.toString(); };
      module.exports._insertCss = function(options) { return insertCss(content, options) };
      
      // Hot Module Replacement
      // https://webpack.github.io/docs/hot-module-replacement
      // Only activated in browser context
      if (false) {
        var removeCss = function() {};
        module.hot.accept("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./Footer.css", function() {
          content = require("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./Footer.css");

          if (typeof content === 'string') {
            content = [[module.id, content, '']];
          }

          removeCss = insertCss(content, { replace: true });
        });
        module.hot.dispose(function() { removeCss(); });
      }
    

/***/ },

/***/ 656:
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(629)();
  // imports


  // module
  exports.push([module.id, ".Footer-root-3Jihw {\n  text-align: center;\n}\n", "", {"version":3,"sources":["/./components/Footer/Footer.css"],"names":[],"mappings":"AAAA;EACE,mBAAmB;CACpB","file":"Footer.css","sourcesContent":[".root {\n  text-align: center;\n}\n"],"sourceRoot":"webpack://"}]);

  // exports
  exports.locals = {
  	"root": "Footer-root-3Jihw"
  };

/***/ },

/***/ 657:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _regenerator = __webpack_require__(69);

  var _regenerator2 = _interopRequireDefault(_regenerator);

  var _values = __webpack_require__(658);

  var _values2 = _interopRequireDefault(_values);

  var _stringify = __webpack_require__(631);

  var _stringify2 = _interopRequireDefault(_stringify);

  var _promise = __webpack_require__(74);

  var _promise2 = _interopRequireDefault(_promise);

  var _slicedToArray2 = __webpack_require__(633);

  var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

  var _asyncToGenerator2 = __webpack_require__(73);

  var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

  var _jsxFileName = '/Users/bryanjensen/Desktop/build-trees/src/routes/champion/index.js';

  var fetchPageData = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(champDataLabel, buildDataLabel) {
      var urls, _ref2, _ref3, champResp, buildsResp, itemsResp, allStatuses, uniqueStatuses, niceErrorObj, champData, buildsData, itemsData;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              urls = ['/champions/' + champDataLabel + '.json', '/champion-builds/' + buildDataLabel + '.json', '/item.json'];
              _context.next = 3;
              return _promise2.default.all(_lodash2.default.map(urls, function (url) {
                return (0, _fetch2.default)(url, {
                  method: 'get',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  }
                });
              }));

            case 3:
              _ref2 = _context.sent;
              _ref3 = (0, _slicedToArray3.default)(_ref2, 3);
              champResp = _ref3[0];
              buildsResp = _ref3[1];
              itemsResp = _ref3[2];
              allStatuses = _lodash2.default.map([champResp, buildsResp, itemsResp], 'status');
              uniqueStatuses = _lodash2.default.uniq(allStatuses);

              if (uniqueStatuses.length === 1 && uniqueStatuses[0] === 200) {
                _context.next = 13;
                break;
              }

              niceErrorObj = _lodash2.default.zipObject(urls, allStatuses);
              throw new Error('Non-zero status on one of the data requests: ' + (0, _stringify2.default)(niceErrorObj));

            case 13:
              _context.next = 15;
              return champResp.json();

            case 15:
              champData = _context.sent;
              _context.next = 18;
              return buildsResp.json();

            case 18:
              buildsData = _context.sent;
              _context.next = 21;
              return itemsResp.json();

            case 21:
              itemsData = _context.sent;

              if (!(!champData || !champData.data)) {
                _context.next = 24;
                break;
              }

              throw new Error('Failed to load the champion data.');

            case 24:
              if (buildsData) {
                _context.next = 26;
                break;
              }

              throw new Error('Failed to load the builds data.');

            case 26:
              if (itemsResp) {
                _context.next = 28;
                break;
              }

              throw new Error('Failed to load the builds data.');

            case 28:

              champData = (0, _values2.default)(champData.data);

              if (!(champData.length !== 1)) {
                _context.next = 31;
                break;
              }

              throw new Error('Champion data was malformed, expected 1 entry got: ' + champData.length);

            case 31:

              champData = champData[0];

              return _context.abrupt('return', {
                champData: champData,
                buildsData: buildsData,
                itemsData: itemsData
              });

            case 33:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function fetchPageData(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var _lodash = __webpack_require__(662);

  var _lodash2 = _interopRequireDefault(_lodash);

  var _react = __webpack_require__(385);

  var _react2 = _interopRequireDefault(_react);

  var _Champion = __webpack_require__(664);

  var _Champion2 = _interopRequireDefault(_Champion);

  var _fetch = __webpack_require__(646);

  var _fetch2 = _interopRequireDefault(_fetch);

  var _Layout = __webpack_require__(648);

  var _Layout2 = _interopRequireDefault(_Layout);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = {
    path: '/c/:champion',

    children: [{
      path: '/',

      action: function action(context) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
          var _ref4, champData, buildsData, itemsData;

          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return fetchPageData(context.params.champion.replace(/ /g, ''), _lodash2.default.lowerCase(context.params.champion));

                case 2:
                  _ref4 = _context2.sent;
                  champData = _ref4.champData;
                  buildsData = _ref4.buildsData;
                  itemsData = _ref4.itemsData;
                  return _context2.abrupt('return', {
                    title: _lodash2.default.startCase(context.params.champion) + ' Builds',
                    component: _react2.default.createElement(
                      _Layout2.default,
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 70
                        },
                        __self: _this
                      },
                      _react2.default.createElement(_Champion2.default, {
                        champion: champData,
                        builds: buildsData,
                        items: itemsData,
                        roleLabel: 'All Roles',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 71
                        },
                        __self: _this
                      })
                    )
                  });

                case 7:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this);
        }))();
      }
    }, {
      path: '/:role',

      action: function action(context) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
          var _ref5, champData, buildsData, itemsData;

          return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return fetchPageData(context.params.champion.replace(/ /g, ''), _lodash2.default.lowerCase(context.params.champion) + '-' + _lodash2.default.lowerCase(context.params.role));

                case 2:
                  _ref5 = _context3.sent;
                  champData = _ref5.champData;
                  buildsData = _ref5.buildsData;
                  itemsData = _ref5.itemsData;
                  return _context3.abrupt('return', {
                    title: _lodash2.default.startCase(context.params.role) + ' ' + _lodash2.default.startCase(context.params.champion) + ' Builds',
                    component: _react2.default.createElement(
                      _Layout2.default,
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 95
                        },
                        __self: _this2
                      },
                      _react2.default.createElement(_Champion2.default, {
                        champion: champData,
                        builds: buildsData,
                        items: itemsData,
                        roleLabel: context.params.role,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 96
                        },
                        __self: _this2
                      })
                    )
                  });

                case 7:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, _this2);
        }))();
      }
    }]
    };

/***/ },

/***/ 664:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _toConsumableArray2 = __webpack_require__(665);

  var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

  var _getPrototypeOf = __webpack_require__(597);

  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

  var _classCallCheck2 = __webpack_require__(601);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass2 = __webpack_require__(602);

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _possibleConstructorReturn2 = __webpack_require__(606);

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits2 = __webpack_require__(607);

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _jsxFileName = '/Users/bryanjensen/Desktop/build-trees/src/routes/champion/Champion.js';

  var _lodash = __webpack_require__(662);

  var _lodash2 = _interopRequireDefault(_lodash);

  var _react = __webpack_require__(385);

  var _react2 = _interopRequireDefault(_react);

  var _withStyles = __webpack_require__(625);

  var _withStyles2 = _interopRequireDefault(_withStyles);

  var _Champion = __webpack_require__(670);

  var _Champion2 = _interopRequireDefault(_Champion);

  var _Link = __webpack_require__(643);

  var _Link2 = _interopRequireDefault(_Link);

  var _ChampionBuilds = __webpack_require__(672);

  var _ChampionBuilds2 = _interopRequireDefault(_ChampionBuilds);

  var _roles = __webpack_require__(676);

  var _roles2 = _interopRequireDefault(_roles);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var Champion = function (_React$Component) {
    (0, _inherits3.default)(Champion, _React$Component);

    function Champion() {
      (0, _classCallCheck3.default)(this, Champion);
      return (0, _possibleConstructorReturn3.default)(this, (Champion.__proto__ || (0, _getPrototypeOf2.default)(Champion)).apply(this, arguments));
    }

    (0, _createClass3.default)(Champion, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        return _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 21
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: 'mdl-grid', __source: {
                fileName: _jsxFileName,
                lineNumber: 22
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { className: 'mdl-cell mdl-cell--12-col', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 23
                },
                __self: this
              },
              _react2.default.createElement(
                'h6',
                { className: _Champion2.default.explanation, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 24
                  },
                  __self: this
                },
                'Click on an item to expand/collapse. Size of branches shows how many times that item was bought. Color of branches indicates the winrate of that particular build.'
              )
            ),
            _lodash2.default.concat.apply(_lodash2.default, [[{ label: 'All', id: '' }]].concat((0, _toConsumableArray3.default)(_roles2.default))).map(function (role) {
              return _react2.default.createElement(
                'div',
                {
                  className: _Champion2.default.roleLinkContainer + ' mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-card mdl-shadow--4dp',
                  key: role.id,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 31
                  },
                  __self: _this2
                },
                _react2.default.createElement(
                  'div',
                  { className: 'mdl-card__actions', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 35
                    },
                    __self: _this2
                  },
                  _react2.default.createElement(
                    _Link2.default,
                    {
                      className: 'mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect',
                      to: '/c/' + _this2.props.champion.id + '/' + role.id,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 36
                      },
                      __self: _this2
                    },
                    role.label
                  )
                )
              );
            })
          ),
          _react2.default.createElement(_ChampionBuilds2.default, {
            builds: this.props.builds,
            champion: this.props.champion,
            items: this.props.items,
            roleLabel: this.props.roleLabel,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 47
            },
            __self: this
          })
        );
      }
    }]);
    return Champion;
  }(_react2.default.Component);

  Champion.propTypes = {
    champion: _react.PropTypes.shape({
      id: _react.PropTypes.string.isRequired
    }).isRequired,
    builds: _react.PropTypes.object.isRequired,
    items: _react.PropTypes.object.isRequired,
    roleLabel: _react.PropTypes.string.isRequired
  };
    exports.default = (0, _withStyles2.default)(_Champion2.default)(Champion);

/***/ },

/***/ 670:
/***/ function(module, exports, __webpack_require__) {

  
      var content = __webpack_require__(671);
      var insertCss = __webpack_require__(630);

      if (typeof content === 'string') {
        content = [[module.id, content, '']];
      }

      module.exports = content.locals || {};
      module.exports._getContent = function() { return content; };
      module.exports._getCss = function() { return content.toString(); };
      module.exports._insertCss = function(options) { return insertCss(content, options) };
      
      // Hot Module Replacement
      // https://webpack.github.io/docs/hot-module-replacement
      // Only activated in browser context
      if (false) {
        var removeCss = function() {};
        module.hot.accept("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./Champion.css", function() {
          content = require("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./Champion.css");

          if (typeof content === 'string') {
            content = [[module.id, content, '']];
          }

          removeCss = insertCss(content, { replace: true });
        });
        module.hot.dispose(function() { removeCss(); });
      }
    

/***/ },

/***/ 671:
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(629)();
  // imports


  // module
  exports.push([module.id, ".Champion-explanation-WaEkp {\n  text-align: center;\n  color: white;\n}\n\n.Champion-roleLinkContainer-ca-Xx {\n  text-align: center;\n  min-height: auto;\n}\n", "", {"version":3,"sources":["/./routes/champion/Champion.css"],"names":[],"mappings":"AAAA;EACE,mBAAmB;EACnB,aAAa;CACd;;AAED;EACE,mBAAmB;EACnB,iBAAiB;CAClB","file":"Champion.css","sourcesContent":[".explanation {\n  text-align: center;\n  color: white;\n}\n\n.roleLinkContainer {\n  text-align: center;\n  min-height: auto;\n}\n"],"sourceRoot":"webpack://"}]);

  // exports
  exports.locals = {
  	"explanation": "Champion-explanation-WaEkp",
  	"roleLinkContainer": "Champion-roleLinkContainer-ca-Xx"
  };

/***/ },

/***/ 672:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _getPrototypeOf = __webpack_require__(597);

  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

  var _possibleConstructorReturn2 = __webpack_require__(606);

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits2 = __webpack_require__(607);

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _classCallCheck2 = __webpack_require__(601);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass2 = __webpack_require__(602);

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _jsxFileName = '/Users/bryanjensen/Desktop/build-trees/src/components/ChampionBuilds/ChampionBuilds.js';

  var _lodash = __webpack_require__(662);

  var _lodash2 = _interopRequireDefault(_lodash);

  var _d = __webpack_require__(673);

  var _d2 = _interopRequireDefault(_d);

  var _react = __webpack_require__(385);

  var _react2 = _interopRequireDefault(_react);

  var _withStyles = __webpack_require__(625);

  var _withStyles2 = _interopRequireDefault(_withStyles);

  var _ChampionBuilds = __webpack_require__(674);

  var _ChampionBuilds2 = _interopRequireDefault(_ChampionBuilds);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var BuildsVisualization = function () {
    (0, _createClass3.default)(BuildsVisualization, null, [{
      key: 'sortNorm',
      // ms

      // scalers enum
      // px
      // px
      // px
      value: function sortNorm(a, b) {
        return b.count - a.count;
      } // px
      // (%)
      // px
      // TEXT_SIZE_MAX derived from PATH_STROKE_MAX
      // px
      // px

    }, {
      key: 'largestChild',
      value: function largestChild(node) {
        return _lodash2.default.maxBy(node.children, 'count');
      }
    }, {
      key: 'getLargestSiblingCount',
      value: function getLargestSiblingCount(treeNode) {
        if (!treeNode.parent) return treeNode.count;
        return _lodash2.default.max(_lodash2.default.map(treeNode.parent.children, 'count'));
      }

      // Collapses a node

    }, {
      key: 'collapse',
      value: function collapse(node) {
        var newNode = node;

        if (newNode.children) {
          newNode.unusedChildren = newNode.children;
          newNode.unusedChildren = newNode.unusedChildren.map(BuildsVisualization.collapse);
          newNode.children = null;
        }

        return newNode;
      }
    }]);

    function BuildsVisualization(jsonData, staticChampData, staticItemData, containerEl) {
      var _this = this;

      (0, _classCallCheck3.default)(this, BuildsVisualization);

      // For React's detachRef
      if (containerEl === null) return;

      this.jsonData = jsonData;
      this.staticChampData = staticChampData;
      this.staticItemData = staticItemData;
      this.containerEl = containerEl;

      this.lastId = 0;

      this.diagonalProjection = _d2.default.svg.diagonal().projection(function (node) {
        return [node.x, node.y];
      });

      this.scalers = {};

      // Colors the paths based on win rate
      this.scalers[BuildsVisualization.SCALER_PATH_COLOR] = _d2.default.scale.linear().domain([0.4, 0.5, 0.6]).range([BuildsVisualization.RED, BuildsVisualization.YELLOW, BuildsVisualization.GREEN]).clamp(true);

      // Scales the images based on pick rate
      this.scalers[BuildsVisualization.SCALER_PATH_SIZE] = _d2.default.scale.linear().domain([0, 1]).range([BuildsVisualization.PATH_STROKE_MIN, BuildsVisualization.PATH_STROKE_MAX]).clamp(true);

      // Scales the images based on pick rate
      this.scalers[BuildsVisualization.SCALER_IMAGE_SIZE] = _d2.default.scale.linear().domain([0, 1]).range([BuildsVisualization.IMAGE_SIZE_MIN, BuildsVisualization.IMAGE_SIZE_MAX]).clamp(true);

      // Scales the text based on pick rate
      this.scalers[BuildsVisualization.SCALER_TEXT_SIZE] = _d2.default.scale.linear().domain([0, 1]).range([BuildsVisualization.TEXT_SIZE_MIN, BuildsVisualization.PATH_STROKE_MAX * BuildsVisualization.TEXT_RELATIVE_SCALE]).clamp(true);

      // Set width based on container
      var width = _d2.default.select(containerEl).node().getBoundingClientRect().width - BuildsVisualization.MARGIN.RIGHT - BuildsVisualization.MARGIN.LEFT;
      // Set height based on tree layer spacing
      var height = BuildsVisualization.LAYER_SPACING * 7 - BuildsVisualization.MARGIN.TOP - BuildsVisualization.MARGIN.BOTTOM;

      // Create the d3 tree
      this.tree = _d2.default.layout.tree().size([width, height]).separation(function (a, b) {
        return a.parent === b.parent ? 0.125 : 0.25;
      }).sort(BuildsVisualization.sortNorm);

      // Create SVG
      this.svg = _d2.default.select(containerEl).append('svg').attr('width', width + BuildsVisualization.MARGIN.RIGHT + BuildsVisualization.MARGIN.LEFT).attr('height', height + BuildsVisualization.MARGIN.TOP + BuildsVisualization.MARGIN.BOTTOM).append('g').attr('transform', 'translate(' + BuildsVisualization.MARGIN.LEFT + ',' + BuildsVisualization.MARGIN.TOP + ')');

      // Data
      this.root = jsonData;
      this.root.x0 = width / 2;
      this.root.y0 = 0;

      // FIXME(bryan): Figure out how to do this the react way
      this.tooltip = _d2.default.select('#tooltip');
      this.tooltip.on('click', function () {
        if (_this.tooltip.classed(_ChampionBuilds2.default.tooltipContainerIsVisible)) {
          _this.tooltip.classed(_ChampionBuilds2.default.tooltipContainerIsVisible, false);
        }
      });
      this.tooltipText = _d2.default.select('#tooltip .mdl-card__title-text');
      this.tooltipCount = _d2.default.select('#tooltip #count');
      this.tooltipWinRate = _d2.default.select('#tooltip #win-rate');

      this.setupInitialState();
    }

    (0, _createClass3.default)(BuildsVisualization, [{
      key: 'setupInitialState',
      value: function setupInitialState() {
        // Collapse the tree
        this.root.children = this.root.children.map(BuildsVisualization.collapse);

        // Display the tree
        this.update(this.root);

        // Open the biggest child
        var toOpen = BuildsVisualization.largestChild(this.root);
        toOpen.x0 = this.root.x0;
        toOpen.y0 = this.root.y0;

        this.clickTreeNode(toOpen);
      }
    }, {
      key: 'toggleTooltip',
      value: function toggleTooltip(hoverIn, node) {
        if (hoverIn) {
          var value = node.count;

          this.tooltipText.text(node.name);
          this.tooltipCount.text(value + '(' + Math.round(100 * (node.count / (node.parent ? node.parent.count : node.count))) + '%)');
          this.tooltipWinRate.text('won: ' + (node.winRate * 100).toFixed(2) + '%');

          this.tooltip.classed(_ChampionBuilds2.default.tooltipContainerIsVisible, true).style('left', _d2.default.event.pageX - 165 + 'px').style('top', _d2.default.event.pageY + 30 + 'px');
        } else {
          this.tooltip.classed(_ChampionBuilds2.default.tooltipContainerIsVisible, false);
        }
      }

      // Multi-purpose scaling function, for paths and such

    }, {
      key: 'multiColorScaler',
      value: function multiColorScaler(node) {
        var element = node.target || node;
        return this.scalers[BuildsVisualization.SCALER_PATH_COLOR](element.winRate);
      }

      // Multi-purpose scaling function, for paths and such

    }, {
      key: 'multiSizeScaler',
      value: function multiSizeScaler(node, type) {
        var scalerFunc = this.scalers[type];
        var targetNode = node.target || node;

        var valueToScale = targetNode.scaleSize || targetNode.count / (targetNode.parent ? targetNode.parent.count : targetNode.count);

        // return scalerFunc(valueToScale / BuildsVisualization.getLargestSiblingCount(targetNode));
        return scalerFunc(valueToScale);
      }

      // Scale image up on hover

    }, {
      key: 'zoomImage',
      value: function zoomImage(hoverIn, node) {
        var image = _d2.default.select('#image_' + (node.target || node).id).transition().duration(BuildsVisualization.DURATION / 4);

        if (hoverIn) {
          image.attr('x', BuildsVisualization.IMAGE_SIZE_MAX * -0.5).attr('y', BuildsVisualization.IMAGE_SIZE_MAX * -0.5).attr('width', BuildsVisualization.IMAGE_SIZE_MAX).attr('height', BuildsVisualization.IMAGE_SIZE_MAX);
        } else {
          image.attr('x', this.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE) * -0.5).attr('y', this.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE) * -0.5).attr('width', this.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE)).attr('height', this.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE));
        }
      }

      // Toggle children on click.

    }, {
      key: 'clickTreeNode',
      value: function clickTreeNode(node) {
        var element = node.source || node;
        var collapsingNode = !!element.children;

        if (collapsingNode || element.scaleSize === 1) {
          delete element.scaleSize;
        } else {
          element.scaleSize = 1;
        }

        // Trying to expand a *collapsed* node with no children
        if (!collapsingNode && element.unusedChildren.length === 0) return;

        if (collapsingNode) {
          // Toggling off
          element.unusedChildren = element.children;
          element.children = null;
        } else {
          // Toggling on
          element.children = element.unusedChildren;
          element.unusedChildren = null;
        }

        this.update(element);
      }

      // Updates the tree after changes

    }, {
      key: 'update',
      value: function update(source) {
        var _this2 = this;

        // Compute the new tree layout.
        var nodes = this.tree.nodes(this.root);
        var links = this.tree.links(nodes);

        // Normalize for fixed-depth.
        nodes = nodes.map(function (node) {
          var newNode = node;
          newNode.y = newNode.depth * BuildsVisualization.LAYER_SPACING;
          return newNode;
        });

        // Update the nodes
        var treeNodes = this.svg.selectAll('g.' + _ChampionBuilds2.default.treeNodeContainer).data(nodes, function (oldNode) {
          if (!oldNode.id) {
            var newNode = oldNode;
            _this2.lastId += 1;
            newNode.id = _this2.lastId;
            return newNode.id;
          }

          return oldNode.id;
        });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = treeNodes.enter().append('g').attr('class', _ChampionBuilds2.default.treeNodeContainer).attr('transform', function () {
          return 'translate(' + source.x0 + ',' + source.y0 + ')';
        }).on('click', this.clickTreeNode.bind(this));

        // When a new node enters, append an image
        nodeEnter.append('image').attr('id', function (node) {
          return 'image_' + node.id;
        }).attr('x', 1e-6).attr('y', 1e-6).attr('height', 1e-6).attr('width', 1e-6).attr('xlink:href', function (node) {
          if (node.itemId) {
            if (_this2.staticItemData.data[node.itemId]) {
              return 'http://ddragon.leagueoflegends.com/cdn/5.15.1/img/item/' + _this2.staticItemData.data[node.itemId].image.full;
            }
            return '';
          }
          return 'http://ddragon.leagueoflegends.com/cdn/5.15.1/img/champion/' + _this2.staticChampData.image.full;
        });

        if (!navigator.userAgent.match(/iPhone/)) {
          nodeEnter.on('mouseover.image', this.zoomImage.bind(this, true)).on('mouseout.image', this.zoomImage.bind(this, false)).on('mouseover.tooltip', this.toggleTooltip.bind(this, true)).on('mouseout.tooltip', this.toggleTooltip.bind(this, false));
        }

        // Transition nodes to their new position.
        var nodeUpdate = treeNodes.transition().duration(BuildsVisualization.DURATION).attr('transform', function (node) {
          return 'translate(' + node.x + ', ' + node.y + ')';
        });

        // When a node is triggered for an update, update the image
        nodeUpdate.select('image').attr('x', function (node) {
          return _this2.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE) * -0.5;
        }).attr('y', function (node) {
          return _this2.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE) * -0.5;
        }).attr('height', function (node) {
          return _this2.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE);
        }).attr('width', function (node) {
          return _this2.multiSizeScaler(node, BuildsVisualization.SCALER_IMAGE_SIZE);
        });

        // Transition exiting nodes to the parent's new position.
        var nodeExit = treeNodes.exit().transition().duration(BuildsVisualization.DURATION).attr('transform', function () {
          return 'translate(' + source.x + ', ' + source.y + ')';
        }).remove();

        // When nodes are exiting, shrink their images
        nodeExit.select('image').attr('width', 1e-6).attr('height', 1e-6).attr('x', 1e-6).attr('y', 1e-6);

        // Update the link nodes
        var linkNode = this.svg.selectAll('g.' + _ChampionBuilds2.default.linkContainer).data(links, function (node) {
          return node.target.id;
        });

        var linkNodeEnter = linkNode.enter();

        // When a new link node enters, insert a 'g' element before all other 'g' elements,
        // so it's drawn first (and behind)
        var linkNodeContents = linkNodeEnter.insert('g', 'g').attr('class', _ChampionBuilds2.default.linkContainer);

        // Enter any new links (paths) at the parent's previous position.
        linkNodeContents.append('path').attr('class', 'link').attr('d', function () {
          var o = { x: source.x0, y: source.y0 };
          return _this2.diagonalProjection({ source: o, target: o });
        }).style('stroke', function (node) {
          return _this2.multiColorScaler(node, true);
        }).style('stroke-width', 1e-6);

        // Enter any new text at the parent's previous position.
        linkNodeContents.append('text').attr('x', function () {
          return source.x0;
        }).attr('y', function () {
          return source.y0;
        }).attr('text-anchor', 'middle').attr('dy', '.35em').attr('fill-opacity', 1e-6).attr('font-size', function (node) {
          return _this2.multiSizeScaler(node, BuildsVisualization.SCALER_TEXT_SIZE);
        }).text(function (node) {
          return Math.round(node.target.count / node.source.count * 100) + '%';
        });

        // Upon an update, perform with a transition delay (animation, etc.)
        var linkNodeUpdate = linkNode.transition().duration(BuildsVisualization.DURATION);

        // Transition links to their new position.
        linkNodeUpdate.select('path.link').attr('d', this.diagonalProjection).style('stroke-width', function (node) {
          return _this2.scalers[BuildsVisualization.SCALER_PATH_SIZE](node.target.count / (node.source ? node.source.count : node.target.count));
        });

        // Transition text to their new position.
        linkNodeUpdate.select('text').attr('fill-opacity', 1).attr('x', function (d) {
          return (d.target.x + d.source.x) * 0.5;
        }).attr('y', function (d) {
          return (d.target.y + d.source.y) * 0.5;
        });

        // Transition exiting nodes to the parent's new position.
        var linkNodeExitPost = linkNode.exit().transition().duration(BuildsVisualization.DURATION).remove();

        linkNodeExitPost.select('text').attr('fill-opacity', 1e-6).attr('x', function () {
          return source.x;
        }).attr('y', function () {
          return source.y;
        });

        // Exiting link nodes bring their paths with, transitioning their position
        linkNodeExitPost.select('path.link').style('stroke-width', 1e-6).attr('d', function () {
          var o = { x: source.x, y: source.y };
          return _this2.diagonalProjection({ source: o, target: o });
        });

        // Stash the old positions for future transitions.
        nodes = nodes.map(function (node) {
          var newNode = node;
          newNode.x0 = newNode.x;
          newNode.y0 = newNode.y;
          return newNode;
        });
      }
    }]);
    return BuildsVisualization;
  }();

  BuildsVisualization.PATH_STROKE_MIN = 0;
  BuildsVisualization.PATH_STROKE_MAX = 40;
  BuildsVisualization.IMAGE_SIZE_MIN = 20;
  BuildsVisualization.IMAGE_SIZE_MAX = 50;
  BuildsVisualization.TEXT_SIZE_MIN = 10;
  BuildsVisualization.LAYER_SPACING = 100;
  BuildsVisualization.TEXT_RELATIVE_SCALE = 0.5;
  BuildsVisualization.RED = '#FF2400';
  BuildsVisualization.YELLOW = '#FFFF00';
  BuildsVisualization.GREEN = '#00AF00';
  BuildsVisualization.MARGIN = { TOP: 50, RIGHT: 50, BOTTOM: 50, LEFT: 50 };
  BuildsVisualization.DURATION = 750;
  BuildsVisualization.SCALER_PATH_COLOR = 1;
  BuildsVisualization.SCALER_PATH_SIZE = 2;
  BuildsVisualization.SCALER_IMAGE_SIZE = 3;
  BuildsVisualization.SCALER_TEXT_SIZE = 4;

  var ChampionBuilds = function (_React$Component) {
    (0, _inherits3.default)(ChampionBuilds, _React$Component);

    function ChampionBuilds() {
      (0, _classCallCheck3.default)(this, ChampionBuilds);
      return (0, _possibleConstructorReturn3.default)(this, (ChampionBuilds.__proto__ || (0, _getPrototypeOf2.default)(ChampionBuilds)).apply(this, arguments));
    }

    (0, _createClass3.default)(ChampionBuilds, [{
      key: 'render',
      value: function render() {
        var _this4 = this;

        return _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 463
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: 'mdl-grid', __source: {
                fileName: _jsxFileName,
                lineNumber: 464
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { className: 'mdl-cell mdl-cell--12-col mdl-card mdl-shadow--4dp', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 465
                },
                __self: this
              },
              _react2.default.createElement(
                'h5',
                { className: _ChampionBuilds2.default.buildsLabel, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 466
                  },
                  __self: this
                },
                _lodash2.default.startCase(this.props.roleLabel) + ' - ' + _lodash2.default.startCase(this.props.champion.id)
              ),
              _react2.default.createElement('div', {
                ref: function ref(node) {
                  _this4.vis = new BuildsVisualization(_this4.props.builds, _this4.props.champion, _this4.props.items, node);
                },
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 469
                },
                __self: this
              })
            )
          ),
          _react2.default.createElement(
            'div',
            { id: 'tooltip', className: _ChampionBuilds2.default.tooltipContainer + ' mdl-card mdl-shadow--4dp', __source: {
                fileName: _jsxFileName,
                lineNumber: 481
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { className: 'mdl-card__title', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 482
                },
                __self: this
              },
              _react2.default.createElement(
                'h4',
                { className: _ChampionBuilds2.default.tooltipTitle + ' mdl-card__title-text', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 483
                  },
                  __self: this
                },
                'Tooltip Title'
              ),
              _react2.default.createElement(
                'div',
                { className: 'mdl-card__subtitle-text', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 486
                  },
                  __self: this
                },
                _react2.default.createElement(
                  'h4',
                  { id: 'count', className: _ChampionBuilds2.default.tooltipSubTitle, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 487
                    },
                    __self: this
                  },
                  'Tooltip Count'
                ),
                _react2.default.createElement(
                  'h4',
                  { id: 'win-rate', className: _ChampionBuilds2.default.tooltipSubTitle, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 490
                    },
                    __self: this
                  },
                  'Tooltip Win Rate'
                )
              )
            )
          )
        );
      }
    }]);
    return ChampionBuilds;
  }(_react2.default.Component);

  ChampionBuilds.propTypes = {
    builds: _react.PropTypes.object.isRequired,
    champion: _react.PropTypes.object.isRequired,
    items: _react.PropTypes.object.isRequired,
    roleLabel: _react.PropTypes.string.isRequired
  };
    exports.default = (0, _withStyles2.default)(_ChampionBuilds2.default)(ChampionBuilds);

/***/ },

/***/ 674:
/***/ function(module, exports, __webpack_require__) {

  
      var content = __webpack_require__(675);
      var insertCss = __webpack_require__(630);

      if (typeof content === 'string') {
        content = [[module.id, content, '']];
      }

      module.exports = content.locals || {};
      module.exports._getContent = function() { return content; };
      module.exports._getCss = function() { return content.toString(); };
      module.exports._insertCss = function(options) { return insertCss(content, options) };
      
      // Hot Module Replacement
      // https://webpack.github.io/docs/hot-module-replacement
      // Only activated in browser context
      if (false) {
        var removeCss = function() {};
        module.hot.accept("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./ChampionBuilds.css", function() {
          content = require("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./ChampionBuilds.css");

          if (typeof content === 'string') {
            content = [[module.id, content, '']];
          }

          removeCss = insertCss(content, { replace: true });
        });
        module.hot.dispose(function() { removeCss(); });
      }
    

/***/ },

/***/ 675:
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(629)();
  // imports


  // module
  exports.push([module.id, "svg {\n  fill: none;\n  stroke-linecap: round;\n}\n\n.ChampionBuilds-buildsLabel-2Xd40 {\n  text-align: center;\n}\n\n.ChampionBuilds-linkContainer-2zUa4 {\n  stroke-opacity: 0.5;\n  cursor: default;\n}\n\n.ChampionBuilds-linkContainer-2zUa4:hover {\n  stroke-opacity: 0.75;\n}\n\n.ChampionBuilds-linkContainer-2zUa4 > text {\n  fill: #777;\n  -webkit-transition: font-size 0.25s;\n  transition: font-size 0.25s;\n}\n\n.ChampionBuilds-linkContainer-2zUa4:hover > text {\n  fill: #444;\n  font-size: 24px;\n}\n\n.ChampionBuilds-treeNodeContainer-37kOg {\n  cursor: pointer;\n}\n\n.ChampionBuilds-tooltipContainer-ik3-V {\n  position: fixed;\n  z-index: -1;\n  opacity: 0;\n  min-height: 0;\n  text-align: center;\n}\n\n.ChampionBuilds-tooltipContainerIsVisible-2IKea {\n  -webkit-transition: opacity 0.25s ease-in-out;\n  transition: opacity 0.25s ease-in-out;\n  opacity: 0.9;\n  z-index: 1;\n}\n\n.ChampionBuilds-tooltipTitle-v69jp {\n  /* Note: relies on the presence of mdl-card__title on the parent */\n  -webkit-align-self: center;\n      -ms-flex-item-align: center;\n              -ms-grid-row-align: center;\n          align-self: center;\n}\n\n.ChampionBuilds-tooltipSubTitle-1Z0wR {\n  margin: 0 10px;\n  white-space: nowrap;\n}\n", "", {"version":3,"sources":["/./components/ChampionBuilds/ChampionBuilds.css"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,sBAAsB;CACvB;;AAED;EACE,mBAAmB;CACpB;;AAED;EACE,oBAAoB;EACpB,gBAAgB;CACjB;;AAED;EACE,qBAAqB;CACtB;;AAED;EACE,WAAW;EACX,oCAA4B;EAA5B,4BAA4B;CAC7B;;AAED;EACE,WAAW;EACX,gBAAgB;CACjB;;AAED;EACE,gBAAgB;CACjB;;AAED;EACE,gBAAgB;EAChB,YAAY;EACZ,WAAW;EACX,cAAc;EACd,mBAAmB;CACpB;;AAED;EACE,8CAAsC;EAAtC,sCAAsC;EACtC,aAAa;EACb,WAAW;CACZ;;AAED;EACE,mEAAmE;EACnE,2BAAmB;MAAnB,4BAAmB;cAAnB,2BAAmB;UAAnB,mBAAmB;CACpB;;AAED;EACE,eAAe;EACf,oBAAoB;CACrB","file":"ChampionBuilds.css","sourcesContent":["svg {\n  fill: none;\n  stroke-linecap: round;\n}\n\n.buildsLabel {\n  text-align: center;\n}\n\n.linkContainer {\n  stroke-opacity: 0.5;\n  cursor: default;\n}\n\n.linkContainer:hover {\n  stroke-opacity: 0.75;\n}\n\n.linkContainer > text {\n  fill: #777;\n  transition: font-size 0.25s;\n}\n\n.linkContainer:hover > text {\n  fill: #444;\n  font-size: 24px;\n}\n\n.treeNodeContainer {\n  cursor: pointer;\n}\n\n.tooltipContainer {\n  position: fixed;\n  z-index: -1;\n  opacity: 0;\n  min-height: 0;\n  text-align: center;\n}\n\n.tooltipContainerIsVisible {\n  transition: opacity 0.25s ease-in-out;\n  opacity: 0.9;\n  z-index: 1;\n}\n\n.tooltipTitle {\n  /* Note: relies on the presence of mdl-card__title on the parent */\n  align-self: center;\n}\n\n.tooltipSubTitle {\n  margin: 0 10px;\n  white-space: nowrap;\n}\n"],"sourceRoot":"webpack://"}]);

  // exports
  exports.locals = {
  	"buildsLabel": "ChampionBuilds-buildsLabel-2Xd40",
  	"linkContainer": "ChampionBuilds-linkContainer-2zUa4",
  	"treeNodeContainer": "ChampionBuilds-treeNodeContainer-37kOg",
  	"tooltipContainer": "ChampionBuilds-tooltipContainer-ik3-V",
  	"tooltipContainerIsVisible": "ChampionBuilds-tooltipContainerIsVisible-2IKea",
  	"tooltipTitle": "ChampionBuilds-tooltipTitle-v69jp",
  	"tooltipSubTitle": "ChampionBuilds-tooltipSubTitle-1Z0wR"
  };

/***/ },

/***/ 676:
/***/ function(module, exports) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = [{
    id: 'top',
    label: 'top'
  }, {
    id: 'jungle',
    label: 'jungle'
  }, {
    id: 'middle',
    label: 'middle'
  }, {
    id: 'adc',
    label: 'adc'
  }, {
    id: 'support',
    label: 'support'
    }];

/***/ },

/***/ 677:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _jsxFileName = '/Users/bryanjensen/Desktop/build-trees/src/routes/notFound/index.js'; /**
                                                                                             * React Starter Kit (https://www.reactstarterkit.com/)
                                                                                             *
                                                                                             * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
                                                                                             *
                                                                                             * This source code is licensed under the MIT license found in the
                                                                                             * LICENSE.txt file in the root directory of this source tree.
                                                                                             */

  var _react = __webpack_require__(385);

  var _react2 = _interopRequireDefault(_react);

  var _Layout = __webpack_require__(648);

  var _Layout2 = _interopRequireDefault(_Layout);

  var _NotFound = __webpack_require__(678);

  var _NotFound2 = _interopRequireDefault(_NotFound);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var title = 'Page Not Found';

  exports.default = {

    path: '*',

    action: function action() {
      return {
        title: title,
        component: _react2.default.createElement(
          _Layout2.default,
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 23
            },
            __self: this
          },
          _react2.default.createElement(_NotFound2.default, { title: title, __source: {
              fileName: _jsxFileName,
              lineNumber: 23
            },
            __self: this
          })
        ),
        status: 404
      };
    }
    };

/***/ },

/***/ 678:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _getPrototypeOf = __webpack_require__(597);

  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

  var _classCallCheck2 = __webpack_require__(601);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass2 = __webpack_require__(602);

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _possibleConstructorReturn2 = __webpack_require__(606);

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits2 = __webpack_require__(607);

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _jsxFileName = '/Users/bryanjensen/Desktop/build-trees/src/routes/notFound/NotFound.js'; /**
                                                                                                * React Starter Kit (https://www.reactstarterkit.com/)
                                                                                                *
                                                                                                * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
                                                                                                *
                                                                                                * This source code is licensed under the MIT license found in the
                                                                                                * LICENSE.txt file in the root directory of this source tree.
                                                                                                */

  var _react = __webpack_require__(385);

  var _react2 = _interopRequireDefault(_react);

  var _withStyles = __webpack_require__(625);

  var _withStyles2 = _interopRequireDefault(_withStyles);

  var _NotFound = __webpack_require__(679);

  var _NotFound2 = _interopRequireDefault(_NotFound);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var NotFound = function (_React$Component) {
    (0, _inherits3.default)(NotFound, _React$Component);

    function NotFound() {
      (0, _classCallCheck3.default)(this, NotFound);
      return (0, _possibleConstructorReturn3.default)(this, (NotFound.__proto__ || (0, _getPrototypeOf2.default)(NotFound)).apply(this, arguments));
    }

    (0, _createClass3.default)(NotFound, [{
      key: 'render',
      value: function render() {
        return _react2.default.createElement(
          'div',
          { className: _NotFound2.default.root, __source: {
              fileName: _jsxFileName,
              lineNumber: 21
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: _NotFound2.default.container, __source: {
                fileName: _jsxFileName,
                lineNumber: 22
              },
              __self: this
            },
            _react2.default.createElement(
              'h1',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 23
                },
                __self: this
              },
              this.props.title
            ),
            _react2.default.createElement(
              'p',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 24
                },
                __self: this
              },
              'Sorry, the page you were trying to view does not exist.'
            )
          )
        );
      }
    }]);
    return NotFound;
  }(_react2.default.Component);

  NotFound.propTypes = {
    title: _react.PropTypes.string.isRequired
  };
    exports.default = (0, _withStyles2.default)(_NotFound2.default)(NotFound);

/***/ },

/***/ 679:
/***/ function(module, exports, __webpack_require__) {

  
      var content = __webpack_require__(680);
      var insertCss = __webpack_require__(630);

      if (typeof content === 'string') {
        content = [[module.id, content, '']];
      }

      module.exports = content.locals || {};
      module.exports._getContent = function() { return content; };
      module.exports._getCss = function() { return content.toString(); };
      module.exports._insertCss = function(options) { return insertCss(content, options) };
      
      // Hot Module Replacement
      // https://webpack.github.io/docs/hot-module-replacement
      // Only activated in browser context
      if (false) {
        var removeCss = function() {};
        module.hot.accept("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./NotFound.css", function() {
          content = require("!!./../../../node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./../../../node_modules/postcss-loader/index.js?pack=default!./NotFound.css");

          if (typeof content === 'string') {
            content = [[module.id, content, '']];
          }

          removeCss = insertCss(content, { replace: true });
        });
        module.hot.dispose(function() { removeCss(); });
      }
    

/***/ },

/***/ 680:
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(629)();
  // imports


  // module
  exports.push([module.id, "/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n:root {/*\n   * Typography\n   * ======================================================================== *//*\n   * Layout\n   * ======================================================================== *//*\n   * Media queries breakpoints\n   * ======================================================================== *//* Extra small screen / phone *//* Small screen / tablet *//* Medium screen / desktop *//* Large screen / wide desktop */\n}\n\n.NotFound-root-3whbd {\n  padding-left: 20px;\n  padding-right: 20px;\n}\n\n.NotFound-container-1BOHG {\n  margin: 0 auto;\n  padding: 0 0 40px;\n  max-width: 1000px;\n}\n", "", {"version":3,"sources":["/./routes/notFound/NotFound.css","/./components/variables.css"],"names":[],"mappings":"AAAA;;;;;;;GAOG;;ACPH;;;;;;;GAOG;;AAEH,OACE;;gFAE8E;;gFAMA;;gFAMA,gCAErB,2BACL,6BACE,iCACI;CAC3D;;ADnBD;EACE,mBAAmB;EACnB,oBAAoB;CACrB;;AAED;EACE,eAAe;EACf,kBAAkB;EAClB,kBAAoC;CACrC","file":"NotFound.css","sourcesContent":["/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n@import '../../components/variables.css';\n\n.root {\n  padding-left: 20px;\n  padding-right: 20px;\n}\n\n.container {\n  margin: 0 auto;\n  padding: 0 0 40px;\n  max-width: var(--max-content-width);\n}\n","/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n:root {\n  /*\n   * Typography\n   * ======================================================================== */\n\n  --font-family-base: 'Segoe UI', 'HelveticaNeue-Light', sans-serif;\n\n  /*\n   * Layout\n   * ======================================================================== */\n\n  --max-content-width: 1000px;\n\n  /*\n   * Media queries breakpoints\n   * ======================================================================== */\n\n  --screen-xs-min: 480px;  /* Extra small screen / phone */\n  --screen-sm-min: 768px;  /* Small screen / tablet */\n  --screen-md-min: 992px;  /* Medium screen / desktop */\n  --screen-lg-min: 1200px; /* Large screen / wide desktop */\n}\n"],"sourceRoot":"webpack://"}]);

  // exports
  exports.locals = {
  	"root": "NotFound-root-3whbd",
  	"container": "NotFound-container-1BOHG"
  };

/***/ }

});
//# sourceMappingURL=client.js.map
import BaseElement from '../BaseElement';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import Registry from '../Registry';

var Router = function (_BaseElement) {
  babelHelpers.inherits(Router, _BaseElement);

  function Router() {
    babelHelpers.classCallCheck(this, Router);

    var _this = babelHelpers.possibleConstructorReturn(this, (Router.__proto__ || Object.getPrototypeOf(Router)).call(this));

    _this.drawRoute = function ($event) {
      var oldPath = _this.setUrl($event);

      var path = window.location.pathname;
      var route = _this.findMatchingRoute(path);

      if (isUndefined(route)) {
        return;
      }

      _this.removeOldRoute(oldPath, route);

      route.url = path;
      var page = route.getAttribute('page');
      var routeElemFunc = Registry.get(page);

      if (isUndefined(routeElemFunc)) {
        console.error('No element registered with name: ' + page);
        return;
      }

      var routeElem = _this.getNewRoute(path, routeElemFunc);

      _this.shadowRoot.appendChild(routeElem);
    };

    _this._routes = [];

    for (var i = 0; i < _this.childNodes.length; i++) {
      if (_this.childNodes[i].tagName === 'WC-ROUTE') {
        _this._routes.push(_this.childNodes[i]);
      }
    }
    return _this;
  }

  babelHelpers.createClass(Router, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      babelHelpers.get(Router.prototype.__proto__ || Object.getPrototypeOf(Router.prototype), 'connectedCallback', this).call(this);
      this.drawRoute();
    }
  }, {
    key: 'addEventListeners',
    value: function addEventListeners() {
      document.addEventListener('urlchanged', this.drawRoute);
    }
  }, {
    key: 'removeEventListeners',
    value: function removeEventListeners() {
      document.removeEventListener('urlchanged', this.drawRoute);
    }
  }, {
    key: 'setUrl',
    value: function setUrl($event) {
      if (isUndefined($event)) {
        return;
      }

      var oldPath = window.location.pathname;

      if ($event.detail.replace === true) {
        window.history.replaceState(null, '', $event.detail.url);
      } else {
        window.history.pushState(null, '', $event.detail.url);
      }

      return oldPath;
    }
  }, {
    key: 'removeOldRoute',
    value: function removeOldRoute(oldPath, route) {
      var oldElem = this.shadowRoot.querySelector('[data-id=content]');

      if (!isUndefined(oldElem) && !isNull(oldElem)) {
        this.shadowRoot.removeChild(oldElem);
        var oldRoute = this.findMatchingRoute(oldPath);
        if (oldRoute.persist === true) {
          this.persistenceMap[oldPath] = oldElem;
        }
      }
    }
  }, {
    key: 'getNewRoute',
    value: function getNewRoute(path, routeElemFunc) {
      var routeElem = this.persistenceMap[path];

      if (isUndefined(routeElem) || isNull(routeElem)) {
        routeElem = new routeElemFunc();
        routeElem.dataset.id = 'content';
      }

      return routeElem;
    }
  }, {
    key: 'findMatchingRoute',
    value: function findMatchingRoute(path) {
      var _this2 = this;

      var realTokens = path.split('/');

      var route = this.routes.find(function (route) {
        var tokens = route.getAttribute('path').split('/');

        var match = _this2.doTokensMatch(tokens, realTokens);

        return match;
      });

      return route;
    }
  }, {
    key: 'doTokensMatch',
    value: function doTokensMatch(tokens, realTokens) {
      var match = tokens.every(function (token, index) {
        var realToken = realTokens[index];

        if (token.startsWith(':')) {
          return true;
        }

        if (token != realToken) {
          return false;
        }

        return true;
      });

      return match;
    }
  }, {
    key: 'template',
    get: function get() {
      return '<div />';
    }
  }, {
    key: 'routes',
    get: function get() {
      return this._routes;
    }
  }, {
    key: 'persistenceMap',
    get: function get() {
      if (isUndefined(this._persistenceMap)) {
        this._persistenceMap = {};
      }

      return this._persistenceMap;
    }
  }]);
  return Router;
}(BaseElement);

var Route = function (_BaseElement2) {
  babelHelpers.inherits(Route, _BaseElement2);
  babelHelpers.createClass(Route, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      babelHelpers.get(Route.prototype.__proto__ || Object.getPrototypeOf(Route.prototype), 'connectedCallback', this).call(this);
    }
  }, {
    key: 'whenConnected',
    value: function whenConnected() {}
  }, {
    key: 'template',
    get: function get() {
      return '<div />';
    }
  }, {
    key: 'path',
    get: function get() {
      this._path;
    }
  }, {
    key: 'page',
    get: function get() {
      return this._page;
    }
  }, {
    key: 'persist',
    get: function get() {
      return this._persist;
    }
  }, {
    key: 'url',
    set: function set(aUrl) {
      this._url = aUrl;
    }
  }]);

  function Route() {
    babelHelpers.classCallCheck(this, Route);

    var _this3 = babelHelpers.possibleConstructorReturn(this, (Route.__proto__ || Object.getPrototypeOf(Route)).call(this));

    _this3._path = _this3.getAttribute('path');
    _this3._page = window.customElements.get(_this3.getAttribute('page'));
    _this3._persist = !isUndefined(_this3.getAttribute('persist'));
    return _this3;
  }

  return Route;
}(BaseElement);

window.customElements.define('wc-router', Router);
window.customElements.define('wc-route', Route);
export { Router, Route };
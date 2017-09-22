import BaseElement from '../BaseElement';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import Registry from '../Registry';

class Router extends BaseElement {

  constructor() {
    super();
    this._routes = [];

    for (let i = 0; i < this.childNodes.length; i++ ){
      if ( this.childNodes[i].tagName === 'WC-ROUTE' ) {
        this._routes.push( this.childNodes[i] );
      }
    }
  }

  get template() {
    return '<div />';
  }

  get routes() {
    return this._routes;
  }

  get persistenceMap() {
    if (isUndefined(this._persistenceMap)) {
      this._persistenceMap = {};
    }

    return this._persistenceMap;
  }

  connectedCallback() {
    super.connectedCallback();
    this.drawRoute();
  }

  addEventListeners() {
    document.addEventListener('urlchanged', this.drawRoute);
  }

  removeEventListeners() {
    document.removeEventListener('urlchanged', this.drawRoute);
  }

  setUrl($event) {
    if (isUndefined($event)) {
      return;
    }

    const oldPath = window.location.pathname;

    if ($event.detail.replace === true) {
      window.history.replaceState(null, '', $event.detail.url);
    }
    else {
      window.history.pushState(null, '', $event.detail.url);
    }

    return oldPath;
  }

  removeOldRoute(oldPath, route) {
    const oldElem = this.shadowRoot.querySelector('[data-id=content]');

    if (!isUndefined(oldElem) && !isNull(oldElem)) {
      this.shadowRoot.removeChild(oldElem);
      const oldRoute = this.findMatchingRoute(oldPath);
      if (oldRoute.persist === true) {
        this.persistenceMap[oldPath] = oldElem;
      }
    }
  }

  getNewRoute(path, routeElemFunc) {
    let routeElem = this.persistenceMap[path];

    if (isUndefined(routeElem) || isNull(routeElem)) {
      routeElem = new routeElemFunc();
      routeElem.dataset.id = 'content';
    }

    return routeElem;
  }

  drawRoute = ($event) => {
    const oldPath = this.setUrl($event);

    const path = window.location.pathname;
    const route = this.findMatchingRoute(path);

    if (isUndefined(route)) {
      return;
    }

    this.removeOldRoute(oldPath, route);

    route.url = path;
    const page = route.getAttribute('page');
    const routeElemFunc = Registry.get(page);

    if (isUndefined(routeElemFunc)) {
      console.error(`No element registered with name: ${page}`);
      return;
    }

    const routeElem = this.getNewRoute(path, routeElemFunc);

    this.shadowRoot.appendChild(routeElem);
  }

  findMatchingRoute(path) {
    const realTokens = path.split('/');

    const route = this.routes.find( route => {
      const tokens = route.getAttribute('path').split('/');

      const match = this.doTokensMatch(tokens, realTokens);

      return match;
    });

    return route;
  }

  doTokensMatch(tokens, realTokens) {
    const match = tokens.every( (token, index) => {
      const realToken = realTokens[index];

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
}

class Route extends BaseElement {

  connectedCallback() {
    super.connectedCallback();
  }

  whenConnected() {

  }

  get template() {
    return '<div />';
  }

  get path() {
    this._path;
  }

  get page() {
    return this._page;
  }

  get persist() {
    return this._persist;
  }

  set url(aUrl) {
    this._url = aUrl;
  }

  constructor() {
    super();

    this._path = this.getAttribute('path');
    this._page = window.customElements.get(this.getAttribute('page'));
    this._persist = !isUndefined(this.getAttribute('persist'));
  }
}

console.log(window.customElements.get('wc-router'));

if ( isUndefined(window.customElements.get('wc-router'))) {
  window.customElements.define('wc-router', Router);
}

if ( isUndefined(window.customElements.get('wc-route'))) {
  window.customElements.define('wc-route', Route);
}

export { Router, Route };

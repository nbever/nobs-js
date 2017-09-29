import { Router, Route } from '../src/Router/index';
import sinon from 'sinon';
import { expect } from 'chai';

describe('Router tests', () => {

  const buildRouteMock = (path) => {
    return {
      getAttribute: (predicate) => {
        return path;
      }
    }
  };

  it('should be able to build child routes', () => {

    const router = new Router();
    sinon.stub(router, 'childNodes').get(() => {
      return [
        { tagName: 'WC-ROUTE' },
        { tagName: 'WC-ROUTE' },
        { tagName: 'DIV' }
      ];
    });

    router.buildRoutes();

    expect(router.routes.length).to.equal(2);
  });

  it('should set the URL correctly', () => {

    const sandbox = sinon.createSandbox();
    const replaceState = sandbox.stub(window.history, 'replaceState');
    const pushState = sandbox.stub(window.history, 'pushState');

    const router = new Router();
    sandbox.stub(router, 'getCurrentLocation').returns('/old/path');

    router.setUrl(undefined);
    expect(replaceState.callCount).to.equal(0);
    expect(pushState.callCount).to.equal(0);

    const replaceEvent = {
      detail: {
        url: '/dino/saur/',
        replace: true
      }
    };

    const pushEvent = {
      detail: {
        url: '/s/are/awesome/',
        replace: false
      }
    };

    const replaceOldPath = router.setUrl(replaceEvent);
    expect(replaceOldPath).to.equal('/old/path');
    expect(replaceState.callCount).to.equal(1);
    expect(pushState.callCount).to.equal(0);
    expect(replaceState.args[0][2]).to.equal('/dino/saur/');

    const pushOldPath = router.setUrl(pushEvent);
    expect(pushOldPath).to.equal('/old/path');
    expect(replaceState.callCount).to.equal(1);
    expect(pushState.callCount).to.equal(1);
    expect(pushState.args[0][2]).to.equal('/s/are/awesome/');

    sandbox.restore();
  });

  it('should match an explicit path', () => {

    const routes = [
      buildRouteMock('/this/is/bad'),
      buildRouteMock('/this/is/good'),
      buildRouteMock('/this/may/be/good'),
    ];

    const router = new Router();
    sinon.stub(router, 'routes').get(() => routes);

    const { route } = router.findMatchingRoute('/this/is/good');
    expect(route).to.equal(routes[1]);
    expect(route).not.to.equal(routes[0]);
  });

  it('should stop after the first match', () => {

    const routes = [
      buildRouteMock('/this/is/bad'),
      buildRouteMock('/this/is/good'),
      buildRouteMock('/this/is/good'),
    ];

    const router = new Router();
    sinon.stub(router, 'routes').get(() => routes);

    const { route } = router.findMatchingRoute('/this/is/good');
    expect(route).to.equal(routes[1]);
    expect(route).not.to.equal(routes[2]);
  });

  it('should match a path with tokens in it', () => {

    const routes = [
      buildRouteMock('/this/is/bad'),
      buildRouteMock('/this/:is/:good'),
      buildRouteMock('/this/is/good'),
    ];

    const router = new Router();
    sinon.stub(router, 'routes').get(() => routes);

    const { route } = router.findMatchingRoute('/this/is/good');
    expect(route).to.equal(routes[1]);
    expect(route).not.to.equal(routes[2]);
  });

  it('should match a path and return the tokens', () => {

    const routes = [
      buildRouteMock('/this/is/bad'),
      buildRouteMock('/this/:is/:dinosaur'),
      buildRouteMock('/this/is/good'),
    ];

    const router = new Router();
    sinon.stub(router, 'routes').get(() => routes);

    const { route, tokens } = router.findMatchingRoute('/this/is/good');
    expect(route).to.equal(routes[1]);
    expect(route).not.to.equal(routes[2]);

    expect(tokens.is).to.equal('is');
    expect(tokens.dinosaur).to.equal('good');
  });
});

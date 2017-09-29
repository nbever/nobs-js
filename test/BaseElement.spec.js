import BaseElement from '../src/BaseElement';
import { expect } from 'chai';
import sinon from 'sinon';

describe('BaseElement', () => {

  window.customElements.define('base-element', BaseElement);

  it('should throw an error if no template is provided', () => {
    const be = new BaseElement();
    expect(() => be.template).to.throw();
  });

  it('should substitue the right things in the temple', () => {
    const be = new BaseElement();
    sinon.stub(be, 'template').get(() => '<div>{{myValue}}</div>');
    be.doAttach();
    be.setAttribute('myValue', 'HEROES!');
  });

  it('should start event listener lifecycle on connection', () => {
    const be = new BaseElement();
    const addListeners = sinon.spy(be, 'addEventListeners');
    sinon.stub(be, 'doSubstitution');

    be.connectedCallback();

    // it's not connected!
    expect( addListeners.callCount ).to.equal( 0 );

    sinon.stub(be, 'isConnected').get(() => true);
    be.connectedCallback();

    // it's not connected!
    expect( addListeners.callCount ).to.equal( 1 );

  });

  it('should remove listeners when disconnected', () => {
    const be = new BaseElement();
    const removeSpy = sinon.spy(be, 'removeEventListeners');

    be.disconnectedCallback();

    expect(removeSpy.callCount).to.equal(1);
  });

  it('should add a class name correctly', () => {
      const element = {};
      const be = new BaseElement();

      be.addClass(element, 'gorilla');
      expect(element.className).to.equal('gorilla');

      be.addClass(element, 'donkey');
      expect(element.className).to.equal('gorilla donkey');

      be.addClass(element, 'donkey');
      expect(element.className).to.equal('gorilla donkey');
  });

  it('should remove a class correctly', () => {
    const element = {};
    const be = new BaseElement();

    be.removeClass(element, 'gorilla');
    expect(element.className).to.be.undefined;

    element.className = 'gorilla';

    be.removeClass(element, 'gorilla');
    expect(element.className).to.equal('');

    element.className = 'dolphin humpback-whale chicken';
    be.removeClass(element, 'humpback-whale');
    expect(element.className).to.equal('dolphin chicken');
  });
});

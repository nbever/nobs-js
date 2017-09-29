// this is because its local - correct way below
import { registerElement, BaseElement } from '../../../../lib';

// Correct way below
// import { BaseElement, registerElement } from 'singel-malt';
import template from './template';
import isUndefined from 'lodash/isUndefined';

class TabBar extends BaseElement {

  get template() {
    return template;
  }

  get tabs() {
    if ( isUndefined(this._tabs) ) {
      this._tabs = [];
    }

    return this._tabs;
  }

  get callbacks() {
    return this._callbacks;
  }

  set tabs(as) {
    this._tabs = as;
  }

  addEventListeners() {
    this.tabs = this.shadowRoot.querySelector('slot').assignedNodes().filter( n => n.tagName === 'A') ;
    this._callbacks = [];
    this.tabs.forEach( tab => {
      const handler = ($event) => this.tabSelected( tab );
      this._callbacks.push(handler);
      tab.addEventListener( 'click', handler );
    });
  }

  removeEventListeners() {
    this.tabs = this.shadowRoot.querySelector('slot').assignedNodes().filter( n => n.tagName === 'A') ;
    this.tabs.forEach( (tab, index) => {
      tab.removeEventListener( 'click', this.callbacks[index] );
    });
  }

  tabSelected = ( tab ) => {
    this.tabs.forEach(t => {
      this.removeClass(t, 'selected');
    });

    this.addClass(tab, 'selected');
  }
}

export default registerElement()(TabBar);

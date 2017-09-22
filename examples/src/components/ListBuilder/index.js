// this is because its local - correct way below
import { registerElement, BaseElement } from '../../../../lib';

// Correct way below
// import { BaseElement, registerElement } from 'nobs-js';

import ListItem from './ListItem';
import isUndefined from 'lodash/isUndefined';
import template from './template';

class ListBuilder extends BaseElement {

  addEventListeners() {
    const button = this.shadowRoot.querySelector('button');
    button.addEventListener('click', this.addTerm);
  }

  removeEventListeners() {
    const button = this.shadowRoot.querySelector('button');
    button.removeEventListener('click', this.addTerm);
  }

  get template() {
    return template;
  }

  addTerm = () => {
    const input = this.shadowRoot.querySelector('input');
    const testValue = input.value;
    this.terms.push(testValue);
    const item = document.createElement('list-item');
    item.setAttribute('item', testValue);
    this.listArea.appendChild(item);
    input.value = '';
  }

  get listArea() {
    return this.shadowRoot.querySelector('.list-area');
  }

  get terms() {
    if (isUndefined(this._terms)) {
      this._terms = [];
    }
    return this._terms;
  }

  set terms(someTerms) {
    this._terms = someTerms;
  }
}

export default registerElement()(ListBuilder);

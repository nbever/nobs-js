// this is because its local - correct way below
import { registerElement, BaseElement } from '../../../../lib';

// Correct way below
// import { BaseElement, registerElement } from 'nobs-js';

import template from './ListItemTemplate';

class ListItem extends BaseElement {

  get template() {
    return template;
  }

  deleteMe = () => {
    const anchor = this.shadowRoot.querySelector('a');
    anchor.removeEventListener('click', this.deleteMe);
    this.parentElement.removeChild(this);
  }

  addEventListeners() {
    const anchor = this.shadowRoot.querySelector('a');
    anchor.addEventListener('click', this.deleteMe);
  }

  removeEventListeners() {
    const anchor = this.shadowRoot.querySelector('a');
    anchor.addEventListener('click', this.deleteMe);
  }
}

export default registerElement()(ListItem);

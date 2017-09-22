import template from './template';

// this is because its local - correct way below
import { registerElement, BaseElement } from '../../../../lib';

// correct way below
// import { BaseElement, registerElement } from 'nobs-js';

class BoringPage extends BaseElement {
  get template() {
    return template;
  }
}

export default registerElement()(BoringPage);

import template from './template';

// this is because its local - correct way below
import { registerElement, BaseElement } from '../../../../lib';

// correct way below
// import { BaseElement, registerElement } from 'single-malt';

class OverviewPage extends BaseElement {

  connectedCallback() {
    super.connectedCallback();
  }

  get template() {
    return template;
  }
}

export default registerElement()(OverviewPage);

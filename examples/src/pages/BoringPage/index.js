import template from './template';

// this is because its local - correct way below
import { registerElement, BaseElement } from '../../../../lib';

// correct way below
// import { BaseElement, registerElement } from 'single-malt';

class BoringPage extends BaseElement {
  get template() {
    return template;
  }

  buttonClicked = () => {
    const scotch = this.BeverageService.pickAScotch();
    alert( `Scotch choice: ${scotch}` );
  }

  addEventListeners() {
    const myButton = this.shadowRoot.querySelector('button');
    myButton.addEventListener('click', this.buttonClicked);
  }

  removeEventListeners() {
    const myButton = this.shadowRoot.querySelector('button');
    myButton.removeEventListener('click', this.buttonClicked);
  }
}

export default registerElement('BeverageService')(BoringPage);

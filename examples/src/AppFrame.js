import ListBuilder from './components/ListBuilder';

// this is because its local - correct way below
import { registerElement, BaseElement } from '../../lib';

// Real way to import
// import { BaseElement, registerElement } from 'single-malt';
import MainTabs from './MainTabs';

class AppFrame extends BaseElement {

  get template() {
    const template = `
      <style>
        div {
          width: 200px;
          height: 200px;
          background-color: red;
          color: white;
        }
      </style>
      <div>
        <main-tabs></main-tabs>
        <span>
        </span>
      </div>
    `;

    return template;
  }
}

export default registerElement()(AppFrame);

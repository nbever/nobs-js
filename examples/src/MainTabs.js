// this is because its local - correct way below
import { Router, Route, registerElement, BaseElement } from '../../lib';

import TabBar from './components/TabBar';
import OverviewPage from './pages/OverviewPage';
import BoringPage from './pages/BoringPage';

// Correct way to import below
// import { Router, BaseElement, registerElement } from 'nobs-js';

class MainTabs extends BaseElement {

  get template() {
    return `
      <div>
        <tab-bar>
          <a data-url="/overview">Overview</a>
          <a data-url="/boring">Student</a>
          <a data-url="/admin">Admin</a>
        </tab-bar>
        <wc-router>
          <wc-route persist path="/overview" page="overview-page"></wc-route>
          <wc-route persist path="/boring" page="boring-page"></wc-route>
        </wc-router>
      </div>
    `;
  }

  navigate($event) {
    const newUrl = $event.target.dataset.url;
    const event = new CustomEvent('urlchanged', {
      detail: {
        url: newUrl,
        replace: true,
      }
    });
    document.dispatchEvent(event);
  }

  addEventListeners() {
    const as = this.shadowRoot.querySelectorAll('tab-bar > a');
    as.forEach( a => {
      a.addEventListener('click', this.navigate);
    });
  }

  removeEventListeners() {
    const as = this.shadowRoot.querySelectorAll('tab-bar > a');
    as.forEach( a => {
      a.removeEventListener('click', this.navigate);
    });
  }
}

export default registerElement()(MainTabs);

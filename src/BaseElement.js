import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';

class BaseElement extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    const filteredTemplate = this.doSubstitution();
    this.shadowRoot.innerHTML = filteredTemplate;
  }

  connectedCallback() {
    if (this.isConnected === false) {
      return;
    }

    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  get template() {
    throw new Error('Not implemented!');
  }

  addEventListeners() {
  }

  removeEventListeners() {
  }

  setAttribute(key, value) {
    super.setAttribute(key, value);
    this.shadowRoot.innerHTML = this.doSubstitution();
  }

  doSubstitution() {
    let template = this.template;
    const replacements = template.match(/[^{{\}]+(?=}})/g);

    if (isUndefined(replacements) || isNull(replacements)) {
      return template;
    }

    replacements.forEach(prop => {
      let newVal = this.getAttribute(prop);

      if (isUndefined(newVal)) {
        newVal = this[prop];
      }

      template = template.replace(`{{${prop}}}`, newVal);
    });

    return template;
  }

  addClass = (element, className) => {
    const clazzes = element.className.split(' ');

    if ( !isUndefined(clazzes.find(c => c == className))) {
      return;
    }

    element.className = element.className + ` ${className}`;
  }

  removeClass = (element, className) => {
    const clazzes = element.className.trim().split(' ');
    const newClasses = clazzes.filter(c => c !== className);
    const classString = newClasses.join(' ');
    element.className = classString;
  }
}

export default BaseElement;

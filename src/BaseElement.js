import { isUndefined, isNull } from './utils';

class BaseElement extends HTMLElement {

  constructor() {
    super();

    // if new-ed directly we will not attach the DOM stuff
    if (Object.getPrototypeOf(this) !== BaseElement.prototype) {
      this.doAttach();
    }
    else {
      console.warn('Calling the BaseElement constructor directly will not attach a shadow DOM automatically.');
      console.warn('When you are ready to use this, make sure to call <this>.doAttach().');
    }
  }

  doAttach() {
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
    if (isUndefined(element)) {
      return;
    }

    let originalClasses = element.className;

    if (isUndefined(originalClasses)) {
      originalClasses = '';
    }
    else if (!originalClasses.endsWith(' ')) {
      originalClasses = `${originalClasses} `;
    }

    const clazzes = isUndefined(element.className) ? [] : element.className.split(' ');

    if ( !isUndefined(clazzes.find(c => c == className))) {
      return;
    }

    element.className = originalClasses + `${className}`;
  }

  removeClass = (element, className) => {

    if (isUndefined(element) || isUndefined(element.className)) {
      return;
    }

    const clazzes = element.className.trim().split(' ');
    const newClasses = clazzes.filter(c => c !== className);
    const classString = newClasses.join(' ');
    element.className = classString;
  }
}

export default BaseElement;

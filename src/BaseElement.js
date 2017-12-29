import { isUndefined, isNull, isNil } from './utils';
import { convertToKabob } from './registerElement';

class BaseElement extends HTMLElement {

  constructor() {
    super();

    this.setDefaults();

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

  setDefaults() {

  }

  addEventListeners() {
  }

  removeEventListeners() {
  }

  find(predicate) {
    return this.shadowRoot.querySelector(predicate);
  }

  findAll(predicate) {
    return this.shadowRoot.querySelectorAll(predicate);
  }

  setAttribute(key, value) {
    super.setAttribute(key, value);
    this.shadowRoot.innerHTML = this.doSubstitution();
  }

  doSubstitution() {
    let template = this.template;
    const replacements = template.match(/[^{{\}]+(?=}})/g);

    if (isNil(replacements)) {
      return template;
    }

    replacements.forEach(prop => {
      const kabobProp = convertToKabob(prop);
      let newVal = this.getAttribute(kabobProp);

      if (isNil(newVal)) {
        newVal = this[prop.trim()];
      }
      else {
        this[prop.trim()] = newVal;
      }

      template = template.replace(`{{${prop}}}`, newVal);
    });

    return template;
  }

  addClass = (element, className) => {
    if (isNil(element)) {
      return;
    }

    let originalClasses = element.className;

    if (isNil(originalClasses)) {
      originalClasses = '';
    }
    else if (!originalClasses.endsWith(' ')) {
      originalClasses = `${originalClasses} `;
    }

    const clazzes = isUndefined(element.className) ? [] : element.className.split(' ');

    if ( !isNil(clazzes.find(c => c == className))) {
      return;
    }

    element.className = originalClasses + `${className}`;
  }

  removeClass = (element, className) => {

    if (isNil(element) || isNil(element.className)) {
      return;
    }

    const clazzes = element.className.trim().split(' ');
    const newClasses = clazzes.filter(c => c !== className);
    const classString = newClasses.join(' ');
    element.className = classString;
  }
}

export default BaseElement;

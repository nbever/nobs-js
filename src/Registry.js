import { isUndefined } from './utils';

let instance = undefined;

class Registry {

  constructor() {
    if (isUndefined(instance)) {
        instance = this;
    }

    return instance;
  }

  get registryMap() {
    if (isUndefined(instance._reg)){
      instance._reg = {};
    }

    return instance._reg;
  }

  static get(aName) {
    return instance.registryMap[aName];
  }

  static define(aName, aConstructor) {
    if (!isUndefined(Registry.get(aName))) {
      return;
    }

    instance.registryMap[aName] = aConstructor;
    window.customElements.define(aName, aConstructor);
  }

  static undefine(aName) {

    if (isUndefined(Registry.get(aName))) {
      return;
    }

    delete instance.registryMap[aName];
  }
}

new Registry();
export default Registry;

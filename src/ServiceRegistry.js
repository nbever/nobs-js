import { isUndefined } from './utils';
import { convertToKabob } from './registerElement';

let instance = undefined;

class ServiceRegistry {

  constructor() {
    if (isUndefined(instance)) {
        instance = this;
    }

    return instance;
  }

  get serviceRegistry() {
    if (isUndefined(instance.registry)) {
      instance.registry = {};
    }

    return instance.registry;
  }

  static getService(serviceName) {
    return instance.serviceRegistry[serviceName];
  }

  static register(...classConstructors) {

    classConstructors.forEach(clazz => {
      instance.serviceRegistry[clazz.name] = new clazz();
    });
  }

  static unregister(...serviceNames) {
    serviceNames.forEach(service => {
      delete instance.serviceRegistry[serviceName];
    });
  }
}

new ServiceRegistry();
export default ServiceRegistry;

import Registry from './Registry';
import ServiceRegistry from './ServiceRegistry';
import { isUndefined } from './utils';

const convertToKabob = (str) => {
  // Convert camelCase capitals to kebab-case.
  str = str.replace(/([a-z][A-Z])/g, function(match) {
    return match.substr(0, 1) + '-' + match.substr(1, 1).toLowerCase();
  });

  // Convert non-camelCase capitals to lowercase.
  str = str.toLowerCase();

  // Convert non-alphanumeric characters to hyphens
  str = str.replace(/[^-a-z0-9]+/g, '-');

  // Remove hyphens from both ends
  str = str.replace(/^-+/, '').replace(/-$/, '');

  return str;
}

const registerElement = ( ...services ) => {
  return (clazz) => {

    // inject the services
    services.forEach(serviceName => {
      const realService = ServiceRegistry.getService(serviceName);

      if (isUndefined(realService)) {
        throw new Error(`Service: ${serviceName} was not found.  Was it registered?`);
      }

      clazz.prototype[serviceName] = realService;
    });

    const elementName = convertToKabob(clazz.name);
    Registry.define(elementName, clazz);

    return clazz;
  }
};

export { convertToKabob };
export default registerElement;

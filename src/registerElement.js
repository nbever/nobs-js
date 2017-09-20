import Registry from './Registry';

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
    clazz.prototype.testing = () => {
      alert( 'cool!' );
    }

    const elementName = convertToKabob(clazz.name);
    Registry.define(elementName, clazz);

    return clazz;
  }
};

export default registerElement;
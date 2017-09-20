import isUndefined from 'lodash/isUndefined';

var instance = undefined;

var Registry = function () {
  function Registry() {
    babelHelpers.classCallCheck(this, Registry);

    if (isUndefined(instance)) {
      instance = this;
    }

    return instance;
  }

  babelHelpers.createClass(Registry, [{
    key: 'registryMap',
    get: function get() {
      if (isUndefined(instance._reg)) {
        instance._reg = {};
      }

      return instance._reg;
    }
  }], [{
    key: 'get',
    value: function get(aName) {
      return instance.registryMap[aName];
    }
  }, {
    key: 'define',
    value: function define(aName, aConstructor) {
      if (!isUndefined(Registry.get(aName))) {
        return;
      }

      instance.registryMap[aName] = aConstructor;
      window.customElements.define(aName, aConstructor);
    }
  }]);
  return Registry;
}();

new Registry();
export default Registry;
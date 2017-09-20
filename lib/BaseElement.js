import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';

var BaseElement = function (_HTMLElement) {
  babelHelpers.inherits(BaseElement, _HTMLElement);

  function BaseElement() {
    babelHelpers.classCallCheck(this, BaseElement);

    var _this = babelHelpers.possibleConstructorReturn(this, (BaseElement.__proto__ || Object.getPrototypeOf(BaseElement)).call(this));

    _this.addClass = function (element, className) {
      var clazzes = element.className.split(' ');

      if (!isUndefined(clazzes.find(function (c) {
        return c == className;
      }))) {
        return;
      }

      element.className = element.className + (' ' + className);
    };

    _this.removeClass = function (element, className) {
      var clazzes = element.className.trim().split(' ');
      var newClasses = clazzes.filter(function (c) {
        return c !== className;
      });
      var classString = newClasses.join(' ');
      element.className = classString;
    };

    _this.attachShadow({ mode: 'open' });
    var filteredTemplate = _this.doSubstitution();
    _this.shadowRoot.innerHTML = filteredTemplate;
    return _this;
  }

  babelHelpers.createClass(BaseElement, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      if (this.isConnected === false) {
        return;
      }

      this.addEventListeners();
    }
  }, {
    key: 'disconnectedCallback',
    value: function disconnectedCallback() {
      this.removeEventListeners();
    }
  }, {
    key: 'addEventListeners',
    value: function addEventListeners() {}
  }, {
    key: 'removeEventListeners',
    value: function removeEventListeners() {}
  }, {
    key: 'setAttribute',
    value: function setAttribute(key, value) {
      babelHelpers.get(BaseElement.prototype.__proto__ || Object.getPrototypeOf(BaseElement.prototype), 'setAttribute', this).call(this, key, value);
      this.shadowRoot.innerHTML = this.doSubstitution();
    }
  }, {
    key: 'doSubstitution',
    value: function doSubstitution() {
      var _this2 = this;

      var template = this.template;
      var replacements = template.match(/[^{{\}]+(?=}})/g);

      if (isUndefined(replacements) || isNull(replacements)) {
        return template;
      }

      replacements.forEach(function (prop) {
        var newVal = _this2.getAttribute(prop);

        if (isUndefined(newVal)) {
          newVal = _this2[prop];
        }

        template = template.replace('{{' + prop + '}}', newVal);
      });

      return template;
    }
  }, {
    key: 'template',
    get: function get() {
      throw new Error('Not implemented!');
    }
  }]);
  return BaseElement;
}(HTMLElement);

export default BaseElement;
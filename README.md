# Single Malt JS

This is a set of utilities to help with WebComponent development for developers that want to use the latest DOM features and don't believe a framework is necessary.  Just like a single malt scotch it's simple, pure and tasty.  This is in it's infancy and suggestions are very welcome.

## Getting Started

To get started just add `single-malt` as a dependency in your packages.json file and away you go!

### Prerequisites

Unfortunately the WebComponents specification is not yet natively implemented in all browsers, so a polyfill is still required.  Luckily the good folks over at Google with the Polymer Project have a great one [here](https://www.webcomponents.org/polyfills).  The bad news is achieving cross-browser compatibility is still tricky.

For those of you using webpack, I have included a sample configuration that I have used with success.  Here is the [webpack.config.js](./examples/webpack.config.js) and here is the [ejs template](./examples/index.html.ejs) I've used that dynamically loads the right mix of polyfills.

Both of these portions were heavily influenced by [this fine artice](http://robdodson.me/how-to-use-polymer-with-webpack/).

## What is this really?

This project is born out of one developers growing irritation of chasing JavaScript frameworks for 10+ years.  When building a web application the question was always: "Which framework are you going to use?".  It started with things like JSF, JSPs, Struts followed by the wave of YUI, Dojo, Backbase etc. followed by GWT, ExtJS, then Angular, Ember, Backbone, Knockout and now React, Vue... the list goes on and on.

Meanwhile, in the background there is a dedicate smart group of folks building this sort of technology directly into the DOM largely marginalizing a lot of these tools and I wondered: "Can you build a complex web app now with nothing but (soon to be) native code?"

The answer is... almost.

WebComponents v1 gives you a heck of a lot, but you still end up writing some boilerplate and solving certain problems over and over so this library was born to abstract those pieces.  The pieces are:

* BaseElement
  A class that extends HTMLElement (A WebComponents thing) and provides a lifecycle as well as template substitutions and DOM registration.  It also handles rendering your template.
* Registry
  With ES6 classes you can run into a scope issue where you lose access to the registered elements.  Typically you never need to touch this because the Router is the only thing accessing it and the register currying takes care of the registration process... but it's there and available.
* registerElement
  This is a method you wrap your class in such that it gets registered with the customElements registry (WebComponents thing) and it also serves as the method to inject services into your class.
* Router
  I probably could have adapted a full featured router for this but in keeping with the spirit of this project, it's a simple router that renders pages associated with routes and injects the wildcard variables.
* ServiceRegistry
  The injection system from Angular was very useful for managing an abstraction between resource management, presentation and business logic so this fulfills that niche in a very simple sort of way.

That's it.  In my opinion WebComponents solves almost everything we need, so a little tooling sugar is all that's necessary to build a full application.  Take a look at the code ... there's nothing to it!

## Practical example

*Work in progress and not all features are completed as of writing this!*

The basic recipe is this:
0. Register your services.
  All of your services need to be registered before any elements are is loaded.  In the example I exploit the difference between `import` and `require` to ensure this happens but there might be other methods - remember - imports are hoisted so beware!

  This is what registration looks like:
  `ServiceRegistry.register(MyElem, MyElem2)`

  where "MyElem" is the class object.  This will also be the key you can use to signal it to be injected into one of your classes.  


1. Extend your class off of BaseElement like so:
  `MyWidget extends BaseElement`
  This puts you into the lifecycle which is just an augmentation of the "rea" WebComponent lifecycle.  During the constructor it will do template substitutions, create the shadowDOM (in open mode) and attach your template to the shadowDom.  In the connectedCallback stage it will call "addEventListeners" which you may want to overwrite so that you can do just that.  There is a corresponding "removeEventListeners" that is called on disconnectedCallback.

2. Create a string template for your widgets DOM structure.
  In the example below they are inline for convenience, but I often import them.  These templates follow the WebComponents style of:
  ```
  <style>
    ...
  </style>
  <div>
    ...
  </div>
  ```
  and will be used for each instantiation.  This is very similar to the JSX in React.

3. Any attributes that you want rendered in the DOM should be added with {{}} syntax.  Something that appears like this: `myattribute={{someprop}}` will end up being rendered with the property value named "someprop".

4. Register your element by currying your class with the registration method.  If you're familiar with Redux this will feel natural:
  ```
  export default registerElement('my-service')(MyWidget);
  ```

  This method will extend your class by augmenting the prototype by finding the services listed and adding them as properties of your class.  It will also take your class and register it with the customElements registry by converting the class name to kabob case (a-b-c).  Here is where you can also declare what services you'd like to have available to this class by passing the class names as arguments into this function.

Here is a ListBuilder widget that takes text and allows you to add it to a growing list, and to remove items from that list:

#### ListBuilder class
```
import BaseElement from '../../utils/BaseElement';
import registerElement from '../../utils/registerElement';
import ListItem from './ListItem';
import isUndefined from 'lodash/isUndefined';
import template from './template';

class ListBuilder extends BaseElement {

  addEventListeners() {
    const button = this.shadowRoot.querySelector('button');
    button.addEventListener('click', this.addTerm);
  }

  removeEventListeners() {
    const button = this.shadowRoot.querySelector('button');
    button.removeEventListener('click', this.addTerm);
  }

  get template() {
    return `
      <style>
        .side {
          display: flex;
        }
      </style>
      <div>
        <div>
          <input placeholder="{{placeholder}}"/>
          <button>Add</button>
        </div>
        <div class="list-area">
        </div>
      </div>`;
  }

  addTerm = () => {
    const input = this.shadowRoot.querySelector('input');
    const testValue = input.value;
    this.terms.push(testValue);
    const item = document.createElement('list-item');
    item.setAttribute('item', testValue);
    this.listArea.appendChild(item);
    input.value = '';
  }

  get listArea() {
    return this.shadowRoot.querySelector('.list-area');
  }

  get terms() {
    if (isUndefined(this._terms)) {
      this._terms = [];
    }
    return this._terms;
  }

  set terms(someTerms) {
    this._terms = someTerms;
  }
}

export default registerElement()(ListBuilder);

```
#### List Builder Item class
```
import BaseElement from '../../utils/BaseElement';
import registerElement from '../../utils/registerElement';
import template from './ListItemTemplate';

class ListItem extends BaseElement {

  get template() {
    return `<style>
      .row {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
      a {
        cursor: pointer;
        padding: 2px;
        background-color: white;
        color: gray;
      }
    </style>
    <div class="row">
      <div>{{item}}</div>
      <a class="delete">X</a>
    </div>`;
  }

  deleteMe = () => {
    const anchor = this.shadowRoot.querySelector('a');
    anchor.removeEventListener('click', this.deleteMe);
    this.parentElement.removeChild(this);
  }

  addEventListeners() {
    const anchor = this.shadowRoot.querySelector('a');
    anchor.addEventListener('click', this.deleteMe);
  }

  removeEventListeners() {
    const anchor = this.shadowRoot.querySelector('a');
    anchor.addEventListener('click', this.deleteMe);
  }
}

export default registerElement()(ListItem);
```

Here you can see in practice the items from above.  One thing that should stand out is that we are acting on DOM nodes with native DOM manipulation.  There is no fancy markup language involved to automatically bind, or construct elements based on state or variables.  This is on purpose to get back to the basics of how applications work, and though it may seem strange at first (especially for those soured by jQuery over the years), things are better now and it's actually quite simple and refreshing to know _everything_ that's going on in your code!

## Router

The Router is admittedly VERY basic and will likely grow over time, so all it does is provide a mechanism to change the URL and to react to different paths.  The router also has the ability to cache routes so that you don't have to save state somewhere and re-initialize when the route goes back to a previous page.  It also allows you the ability to decide whether the new route goes into the history (i.e. the back button) or not.

To use it is quite simple, you specify a router with child routes, and each child route has a path match, a persistence flag and the component that it should render.  Something like this:

```
<wc-router>
  <wc-route persist path="/overview" page="overview-page"></wc-route>
  <wc-route persist path="/students" page="student-page"></wc-route>
</wc-router>
```

When the route is triggered it will use the component key to find the constructor in the Registry and then render that element.  If the route was persisted in the session it will just pull it back out and attach it back into the DOM.

## Contributions Welcome

This is just the beginning of something I hope will be useful, any contributions will be considered so feel free to fork this repository and submit ideas.  I can't stress enough that there are likely smarter way to accomplish some of these things and I'd love to see this evolve.

## Authors

*Nate Bever* - Initial work - [nbever](https://github.com/nbever)

## License

This project is licensed under the ISC License - see the [licenese](LICENSE.md) file for details

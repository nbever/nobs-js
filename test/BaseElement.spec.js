// const assert = require('assert');
// const sinon = require('sinon');
import BaseElement from '../src/BaseElement';
import { expect } from 'chai';

describe('BaseElement', () => {

  it('should throw an error if no template is provided', () => {
    const be = new BaseElement();
    expect(be.template).to.throw();
  });
});

import registerElement, { convertToKabob } from '../src/registerElement';
import ServiceRegistry from '../src/ServiceRegistry';

describe('registerElement', () => {

  it('should convert to kabob case', () => {
    const firstTest = 'firstTestConversion';
    const result = convertToKabob(firstTest);

    expect(result).to.equal('first-test-conversion');

    const secondTest = 'SecondTestConversion';
    const result2 = convertToKabob(secondTest);
    expect(result2).to.equal('second-test-conversion');
  });

  it('should inject new services', () => {
    const getServiceStub = sinon.stub(ServiceRegistry, 'getService');
    getServiceStub.withArgs('treeService').returns({
      treeType: 'Juniper'
    });

    getServiceStub.withArgs('homeService').returns({
      washer: 'GE',
      dryer: 'Samsung'
    });

    const fakeClass = {
      prototype: {},
      name: 'fakeClass'
    };

    const clazz = registerElement('treeService', 'homeService')(fakeClass);
    expect(clazz.prototype.treeService).not.to.be.undefined;
    expect(clazz.prototype.treeService.treeType).to.equal('Juniper');
    expect(clazz.prototype.homeService.dryer).to.equal('Samsung');
  });
});

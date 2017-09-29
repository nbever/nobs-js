import ServiceRegistry from '../src/ServiceRegistry';

describe('ServiceRegistry', () => {

  it('should not allow multiple instances', () => {
    const reg = new ServiceRegistry();
    const reg2 = new ServiceRegistry();

    expect(reg).to.equal(reg2);
  });

  it('should create the registry on access only', () => {
    const reg = new ServiceRegistry();

    expect(reg.registry).to.be.undefined;
    expect(reg.serviceRegistry).not.to.be.undefined;
  });
});

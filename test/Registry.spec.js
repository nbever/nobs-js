import Registry from '../src/Registry';

describe('Registry', () => {

  it('should not be allowed to create two instances', () => {
    const reg = new Registry();
    const reg2 = new Registry();

    expect(reg).to.equal(reg2);
  });

  it('should create an empty registry is none is there on access', () => {
    const reg = new Registry();
    expect(reg._reg).to.be.undefined;
    expect(reg.registryMap).not.to.be.undefined;
  });

  it('should be able to store and retrieve and element', () => {
    const reg = new Registry();
    expect(Registry.get('face-plate')).to.be.undefined;

    const cookieFunction = () => 'cookies!';

    Registry.define('face-plate', cookieFunction);
    expect(Registry.get('face-plate')).to.equal(cookieFunction);
    expect(reg._reg['face-plate']).to.equal(cookieFunction);

    Registry.undefine('face-plate');
  });
});

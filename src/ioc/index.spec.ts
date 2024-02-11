import assert from "assert";
import '../../test/ioc/Wheel';
import '../../test/ioc/Audi';
import '../../test/ioc/context/Material';
import '../../test/ioc/context/Wheel';
import '../../test/ioc/context/WheelNew';
import '../../test/ioc/context/SubMaterial';
import '../../test/ioc/context/Audi';

import '../../test/ioc/cycle/A';
import '../../test/ioc/cycle/B';

import { Company } from "../../test/ioc/Company";
import { Company as CCompany } from "../../test/ioc/context/Company";
import { Company as CyCompany } from "../../test/ioc/cycle/Company";

import { C1, symbol as lazySymbolC1, setContainer } from '../../test/ioc/lazywired/C1';


describe('ioc test', () => {
  beforeEach(() => {});

  it('should decorator singleton', () => {
    const company: Company = new Company();
    const result = company.run();
    assert.strictEqual(result, 'audi drive this is wheel');

    const company2: Company = new Company();
    assert.strictEqual(company.getCar(), company2.getCar());
  });

  it('should decorator singleton cycle', () => {
    const company: CyCompany = new CyCompany();
    const result = company.run();
    assert.strictEqual(result, 'in B 2 in A in B 1');
  });

  it('should decorator context', () => {
    const company: CCompany = new CCompany();
    const result = company.run();
    assert.strictEqual(result, 'audi drive this is wheel from Material from SubMaterial|this is new wheel from Material from SubMaterial');

    const company2: CCompany = new CCompany();
    assert.notStrictEqual(company.getCar(), company2.getCar());

    assert.strictEqual(company.getCar().getWheel(), company2.getCar().getWheel());
    assert.strictEqual(company.getCar().getWheel().getMaterial(), company2.getCar().getWheel().getMaterial());
    assert.strictEqual(company.getCar().getWheel().getMaterial().getSubMaterial(), company2.getCar().getWheel().getMaterial().getSubMaterial());
    assert.notStrictEqual(company.getCar().getWheel(), company.getCar().getWheelNew());
    assert.notStrictEqual(company.getCar().getWheel().getMaterial(), company.getCar().getWheelNew().getMaterial());
    assert.notStrictEqual(company.getCar().getWheel().getMaterial().getSubMaterial(), company.getCar().getWheelNew().getMaterial().getSubMaterial());

    // 测试同一个类，即可单例，也可以多例，wheel和wheelnew是单例，material是多例，subMaterial是多例，SingleSubMaterial是单例
    assert.notStrictEqual(company.getCar().getWheel().getMaterial(), company.getCar().getWheelNew().getMaterial());

    assert.strictEqual(company.getCar().getWheel().getMaterial().getSingleSubMaterial(), company2.getCar().getWheelNew().getMaterial().getSingleSubMaterial());
    assert.notStrictEqual(company.getCar().getWheel().getMaterial().getSubMaterial(), company.getCar().getWheelNew().getMaterial().getSubMaterial());
    assert.notStrictEqual(company.getCar().getWheelNew().getMaterial().getSubMaterial(), company.getCar().getWheelNew().getMaterial().getSingleSubMaterial());
  });

  it('should decorator lazywired', () => {
    const c1: C1 = new C1();
    setContainer(lazySymbolC1, 'walt');
    assert.strictEqual(c1.getService().name, 'walt');

    setContainer(lazySymbolC1, 'best');
    assert.strictEqual(c1.getService().name, 'best');
  });

});
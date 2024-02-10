import assert from "assert";
import '../../test/ioc/Wheel';
import '../../test/ioc/Audi';
import { Company } from "../../test/ioc/Company";

describe('ioc test', () => {
  beforeEach(() => {});

  it('should decorator singleton', () => {
    const company: Company = new Company();
    const result = company.run();
    assert.strictEqual(result, 'audi drive this is wheel');

    const company2: Company = new Company();
    assert.strictEqual(company.getCar(), company2.getCar());
  })
});
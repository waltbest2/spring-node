import { autowired, component } from '../../../src/ioc/decorator';
import { IocScope } from '../../../src/ioc/container';
import { IWheel, symbol } from './IWheel';
import { symbol as IMSymbol, IMaterial } from './IMaterial';

@component(symbol)
export class Wheel implements IWheel {
  @autowired(IMSymbol, IocScope.CONTEXT)
  material: IMaterial;

  drive(): string {
    return 'this is wheel ' + this.material.reColor();
  }

  getMaterial(): IMaterial {
    return this.material;
  }
}
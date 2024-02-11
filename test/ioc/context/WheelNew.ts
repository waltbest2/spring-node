import { autowired, component } from '../../../src/ioc/decorator';
import { IocScope } from '../../../src/ioc/container';
import { symbol as IMSymbol, IMaterial } from './IMaterial';
import { IWheelNew, symbol } from './IWheelNew';

@component(symbol)
export class WheelNew implements IWheelNew {
  @autowired(IMSymbol, IocScope.CONTEXT)
  material: IMaterial;

  driveNew(): string {
    return 'this is new wheel ' + this.material.reColor();
  }

  getMaterial(): IMaterial {
    return this.material;
  }
}
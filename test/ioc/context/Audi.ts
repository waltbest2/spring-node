import { component, autowired } from '../../../src/ioc/decorator';
import { ICar, symbol as symICar } from './ICar';
import { IWheel, symbol as symIWheel } from './IWheel';
import { IWheelNew, symbol as symIWheelNew } from './IWheelNew';

@component(symICar)
export class Audi implements ICar {
  @autowired(symIWheel)
  private wheel: IWheel;

  @autowired(symIWheelNew)
  private wheelNew: IWheelNew;

  clean(): void {
    throw new Error('Method not implemented.');
  }

  repair(): void {
    throw new Error('Method not implemented.');
  }

  drive(): string {
    return 'audi drive ' + this.wheel.drive() + '|' + this.wheelNew.driveNew();
  }

  getWheel(): IWheel {
    return this.wheel;
  }

  getWheelNew(): IWheelNew {
    return this.wheelNew;
  }
}
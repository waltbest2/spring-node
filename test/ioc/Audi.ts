import { autowired, component } from '../../src/ioc/decorator';
import { ICar, symbol as symICar } from './ICar';
import { IWheel, symbol as symIWheel } from './IWheel';

@component(symICar)
export class Audi implements ICar {
  @autowired(symIWheel)
  private wheel: IWheel;

  clean(): void {
    throw new Error('Method not implemented');
  }

  repair(): void {
    throw new Error('Method not implemented');
  }

  drive(): string {
    return 'audi drive ' + this.wheel.drive();
  }
}
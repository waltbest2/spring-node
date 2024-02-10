import { ICar, symbol as symICar } from './ICar';
import { autowired } from '../../src/ioc/decorator';

export class Company {
  @autowired(symICar)
  private car: ICar;

  public run() {
    return this.car.drive();
  }

  getCar() {
    return this.car;
  }
}
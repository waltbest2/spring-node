import { autowired, useContext } from '../../../src/ioc/decorator';
import { IocScope } from '../../../src/ioc/container';
import { ICar, symbol as symICar } from './ICar';

export class Company {
  @autowired(symICar, IocScope.CONTEXT)
  private car: ICar;

  constructor() {
    useContext(this);
  }

  public run() {
    return this.car.drive();
  }

  getCar() {
    return this.car;
  }
}
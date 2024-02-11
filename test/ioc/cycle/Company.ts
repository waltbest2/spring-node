import { autowired } from '../../../src/ioc/decorator';
import { IB, symbol } from './IB';

export class Company {
  @autowired(symbol)
  private b: IB;

  public run() {
    return this.b.print2();
  }
}
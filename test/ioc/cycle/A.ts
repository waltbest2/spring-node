import { component, autowired } from '../../../src/ioc/decorator';
import { IA, symbol } from './IA';
import { IB, symbol as ibSymbol } from './IB';

@component(symbol)
export class A implements IA {
  @autowired(ibSymbol)
  private b: IB;

  print() {
    return 'in A ' + this.b.print();
  }
}
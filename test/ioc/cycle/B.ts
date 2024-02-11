import { component, autowired } from '../../../src/ioc/decorator';
import { IB, symbol } from './IB';
import { IA, symbol as iaSymbol } from './IA';

@component(symbol)
export class B implements IB {
  @autowired(iaSymbol)
  private a: IA;

  print(): string {
    return 'in B 1';
  }

  print2(): string {
    return 'in B 2 ' + this.a.print();
  }
}
import { IWheel, symbol } from "./IWheel";
import { component } from '../../src/ioc/decorator';

@component(symbol)
export class Wheel implements IWheel {
  drive(): string {
    return 'this is wheel';
  }
}
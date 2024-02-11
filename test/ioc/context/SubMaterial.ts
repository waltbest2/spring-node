import { component } from '../../../src/ioc/decorator';
import { ISubMaterial, symbol } from "./ISubMaterial";

@component(symbol)
export class SubMaterial implements ISubMaterial {
  print(): string {
    return 'from SubMaterial';
  }
}
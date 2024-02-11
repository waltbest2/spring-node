import { lazywired, container } from '../../../src/ioc/decorator';

export function setContainer(symbol: Symbol, name: string) {
  container.setInstance(symbol, {
    name,
  });
}

export const symbol = Symbol('Test');

export class C1 {
  @lazywired(symbol)
  private service: any;

  getService(): any {
    return this.service;
  }
}
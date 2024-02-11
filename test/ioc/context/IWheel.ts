import { IMaterial } from './IMaterial'

export interface IWheel {
  drive(): string;

  getMaterial(): IMaterial;
}

export const symbol = Symbol('IWheel');
import { IMaterial } from './IMaterial'

export interface IWheelNew {
  driveNew(): string;

  getMaterial(): IMaterial;
}

export const symbol = Symbol('IWheelNew');
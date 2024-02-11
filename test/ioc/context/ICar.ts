import { IWheel } from './IWheel';
import { IWheelNew } from './IWheelNew';

export interface ICar {
  drive(): string;

  clean(): void;

  repair(): void;

  getWheel(): IWheel;

  getWheelNew(): IWheelNew;
}

export const symbol = Symbol('ICar');
export interface ICar {
  drive(): string;

  clean(): void;

  repair(): void;
}

export const symbol = Symbol('ICar');
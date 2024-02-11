import { ISubMaterial } from './ISubMaterial'

export interface IMaterial {
  reColor(): string;

  getSubMaterial(): ISubMaterial;

  getSingleSubMaterial(): ISubMaterial;
}

export const symbol = Symbol('IMaterial');
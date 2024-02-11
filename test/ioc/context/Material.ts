import { autowired, component } from '../../../src/ioc/decorator';
import { IocScope } from '../../../src/ioc/container';
import { symbol, IMaterial } from './IMaterial';
import { ISubMaterial, symbol as subSymbol} from './ISubMaterial';

@component(symbol)
export class Material implements IMaterial {
  @autowired(subSymbol, IocScope.CONTEXT)
  private subMaterial: ISubMaterial;

  @autowired(subSymbol)
  private subMaterial2: ISubMaterial;

  getSubMaterial(): ISubMaterial {
    return this.subMaterial;
  }

  getSingleSubMaterial(): ISubMaterial {
    return this.subMaterial2;
  }

  reColor(): string {
    return 'from Material ' + this.subMaterial.print();
  }
}
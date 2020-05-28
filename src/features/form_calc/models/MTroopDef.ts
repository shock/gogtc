import { NumEntry } from '../types';
import { MFormCalc } from './MFormCalc';
import { MFormCalc } from './MFormCalc';

type TroopDefParams = ConstructorParameters<typeof TroopDef>;

export class TroopDef {
  tierDef: TierDef | null = null;
  type: TroopType;
  count: Int;

  constructor(type:TroopType, count:Int) {
    this.type = type;
    this.count = count;
  }

  id():string {
    if ( !this.tierDef )
      throw new Error('attribute tierDef is null');
    return `${this.tierDef.id()}:${this.type}`;
  }
}

class MTroopDef extends TroopDef {
  formCalc: MFormCalc;

  constructor(formCalc: MFormCalc, ...args:TroopDefParams ) {
    super(...args);
    this.formCalc = formCalc;
  }

  getNumEntry():NumEntry {
    return {
      id: this.id(),
      value: this.count.toString(),
      label: this.type
    }
  };
};

export { MTroopDef };
import { KeyedNumEntry, NumEntry, TroopDef } from '../types';
import { MFormCalc } from './MFormCalc';

type TroopDefParams = ConstructorParameters<typeof TroopDef>;

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
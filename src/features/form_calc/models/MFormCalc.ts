import { KeyedNumEntry, NumEntry } from '../types';
import { MTierDef } from '.';

type FormCalcParams = ConstructorParameters<typeof FormCalc>;

export class FormCalc {
  name: string;
  tierDefs: MTierDef[] = [];

  constructor(name:string) {
    this.name = name;
  }

  addTierDefs(tierDefs: MTierDef[]) {
    this.tierDefs = tierDefs;
  }

  setTierDefs(tierDef: MTierDef) {
    this.tierDefs.push(tierDef);
  }

  id():string {
    return this.name;
  }
}class MFormCalc extends FormCalc {
};

export { MFormCalc };
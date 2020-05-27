import { KeyedNumEntry, NumEntry, TierDef } from '../types';
import { MFormCalc } from './MFormCalc';

type TierDefParams = ConstructorParameters<typeof TierDef>;

class MTierDef extends TierDef {
  formCalc: MFormCalc;

  constructor(formCalc: MFormCalc, ...args:TierDefParams ) {
    super(...args);
    this.formCalc = formCalc;
  }

  getNumEntries():KeyedNumEntry {
    let numEntries:KeyedNumEntry = {};
    this.troopDefs.forEach( (troopDef) => {
      let numEntry:NumEntry = {
        id: troopDef.id(),
        value: troopDef.count.toString(),
        label: troopDef.type
      }
      numEntries[numEntry.id] = numEntry;
    });
    return numEntries;
  };
};

export { MTierDef };
import { KeyedNumEntry, NumEntry, TierDef } from '../types';

class MTierDef extends TierDef {

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
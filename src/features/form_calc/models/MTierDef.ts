import { KeyedNumEntry, NumEntry, TierNum, TroopType } from '../types';
import { MFormCalc, MTroopDef } from '.';

class MTierDef {
  formCalc: MFormCalc | null = null;
  tierNum: TierNum;
  troopDefs: MTroopDef[] = [];

  constructor(tierNum:TierNum) {
    this.tierNum = tierNum;
  }

  addTroopDef(troopDef: MTroopDef) {
    this.troopDefs.push(troopDef);
  }

  setTroopDefs(troopDefs: MTroopDef[]) {
    this.troopDefs = troopDefs;
  }

  id():string {
    if ( !this.formCalc )
      throw new Error('attribute formCalc is null');
    return `${this.formCalc.id()}:${this.tierNum}`;
  }

  findTroopDef( troopType: TroopType ) {

    const selected = this.troopDefs.find( troopDef => troopDef.type === troopType );
    if( selected === undefined )
      throw new Error(`could not find MTroopDef with type ==${troopType}`)
    return selected;
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
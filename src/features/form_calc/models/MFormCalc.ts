import { MTierDef, MTroopDef } from '.';
import { KeyedNumEntry, TierNum, TroopType } from '../types';


class MFormCalc {
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

  findTierDef( tierNum: TierNum ) {

    const selected = this.tierDefs.find( tierDef => tierDef.tierNum === tierNum );
    if( selected === undefined )
      throw new Error(`could not find MTierDef with tierNum ==${tierNum}`)
    return selected;
  }

  updateTroopDef( id: string, troopDefUpdate:MTroopDef) {
    const idParts = id.split(':');
    const tierNum = idParts[0] as TierNum;
    const troopType = idParts[1] as TroopType;
    const tierDef = this.findTierDef(tierNum);
    const troopDef = tierDef.findTroopDef( troopType );
    // troopDef.updateFromAction(troopDefUpdate);
  }

  getNumEntries() {
    let numEntries:KeyedNumEntry = {};
    this.tierDefs.forEach((tierDef) => {
      numEntries = Object.assign({}, numEntries, tierDef.getNumEntries());
    });
    return numEntries;
  }
};

export { MFormCalc };
import { TierNum, TroopType, Int, toInt } from '../types';
import { MFormCalc, MTroopDef } from '.';

class MTierDef {
  formCalc: MFormCalc | null = null;
  tierNum: TierNum;
  troopDefs: MTroopDef[] = [];
  tierCap:Int = toInt(0);
  tierPercent:number = 0;


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

  /*
    COMPUTATION FUNCTIONS
  */

  // gets the tier cap using the existing troop def counts
  // does not set this.tierCap
  getCapFromTroopDefs() {
    let tierCap = 0;
    this.troopDefs.forEach( troopDef => {
      tierCap += troopDef.count;
    });
    return tierCap;
  }

  updateCap(tierCap:Int) {
    this.tierCap = tierCap;
  }

  updatePercent(tierPercent:number) {
    this.tierPercent = tierPercent;
  }

};

export { MTierDef };
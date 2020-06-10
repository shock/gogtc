import { TierNum, TroopType, Int, toInt } from '../types';
import { MFormCalc, MTroopDef } from '.';

class MTierDef {
  formCalc: MFormCalc | null = null;
  tierNum: TierNum;
  troopDefs: MTroopDef[] = [];
  capacity:Int = toInt(0);
  percent:number = 0;
  capacityLocked:boolean = false;
  percentLocked:boolean = false;

  constructor(tierNum:TierNum) {
    this.tierNum = tierNum;
  }

  asJsonObject() {
    let obj:any = {};
    obj.tierNum = this.tierNum;
    obj.capacity = this.capacity;
    obj.percent = this.percent;
    obj.capacityLocked = this.capacityLocked;
    obj.percentLocked = this.percentLocked;
    obj.troopDefs = this.troopDefs.map( troopDef => {
      return troopDef.asJsonObject();
    });
    return obj;
  }

  id():string {
    if ( !this.formCalc )
      throw new Error('attribute formCalc is null');
    return `${this.formCalc.id()}:${this.tierNum}`;
  }

  debug() {
    return this.formCalc?.debug;
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
  // does not set this.capacity
  getCapFromTroopDefs() {
    let capacity = 0;
    this.troopDefs.forEach( troopDef => {
      capacity += troopDef.count;
    });
    return toInt(capacity);
  }

  updateCap(capacity:Int) {
    if( this.percentLocked ) return;
    this.capacity = capacity;
  }

  updatePercent(percent:number) {
    if( this.capacityLocked ) return;
    this.percent = percent;
  }

  updateCapacityLock(state: boolean) {
    this.capacityLocked = state;
    if( state ) {
      this.troopDefs.forEach( troopDef => troopDef.updateCountLock(state) );
    }
    this.percentLocked = this.percentLocked && !this.capacityLocked;
  }

  updatePercentLock(state: boolean) {
    this.percentLocked = state;
    this.capacityLocked = this.capacityLocked && !this.percentLocked;
  }

  resolveLockStates() {
    let allTroopDefsLocked = true;
    this.troopDefs.forEach( troopDef => {
      allTroopDefsLocked = allTroopDefsLocked && troopDef.countLocked;
    });
    this.updateCapacityLock(allTroopDefsLocked);
  }

  getLockedTroopCount():Int {
    let lockedCount:Int = toInt(0);
    this.troopDefs.forEach( troopDef => {
      if( troopDef.countLocked ) {
        lockedCount = toInt(lockedCount + troopDef.count);
      }
    });
    return lockedCount;
  }

  getUnlockedCapacity():Int {
    return toInt(this.capacity - this.getLockedTroopCount());
  }

  troopPercentSum():number {
    let sum = 0;
    this.troopDefs.forEach( troopDef => sum += troopDef.percent );
    return sum;
  }

  troopPercentDelta() {
    return this.troopPercentSum() - 100;
  }

  troopPercentSumOver():boolean {
    return this.troopPercentDelta() > 0;
  }

  troopPercentSumUnder():boolean {
    return this.troopPercentDelta() < 0 ;
  }

  fixTroopPercent(troopDef:MTroopDef) {
    let newPercent = troopDef.percent - this.troopPercentDelta();
    if( newPercent < 0 ) { newPercent = 0; }
    if( newPercent > 100 ) { newPercent = 100; }
    troopDef.percent = newPercent;
  }

  getLockedTroopPercent():number {
    let lockedPercent = 0;
    this.troopDefs.forEach( troopDef => {
      if( troopDef.percentLocked ) {
        lockedPercent += troopDef.percent;
      }
    });
    return lockedPercent;
  }

  getUnlockedPercent():number {
    return 100 - this.getLockedTroopPercent();
  }

  calculateAndUpdateTroopPercents(fixDelta:boolean = true) {
    this.troopDefs.forEach( troopDef => {
      troopDef.calculateAndUpdatePercent(this.getUnlockedCapacity());
    });
    if( fixDelta && this.troopPercentDelta() !== 0 ) {
      let firstUnlockedTroopDef:MTroopDef|null = null;
      for( let i=0; i<this.troopDefs.length; i++ ) {
        if( !this.troopDefs[0].countLocked ) {
          firstUnlockedTroopDef = this.troopDefs[0];
          break;
        }
      }
      if( firstUnlockedTroopDef ) {
        this.fixTroopPercent(firstUnlockedTroopDef);
      }
    }
  }

  calculateAndUpdateTroopCounts() {
    this.troopDefs.forEach( troopDef => {
      troopDef.calculateAndUpdateCount(this.getUnlockedCapacity());
    });
  }

  calculateAndUpdatePercent(marchCap:Int) {
    if(marchCap === 0 || this.capacityLocked) {
      this.percent = 0;
    } else {
      const strVal = (Math.round(this.capacity * 100000 / marchCap) / 1000).toFixed(4);
      this.percent = parseFloat(strVal);
    }
    return this.percent;
  }

  calculateAndUpdateCap(marchCap:Int) {
    if( !this.capacityLocked ) {
      const strVal = Math.round(this.percent * marchCap / 100);
      this.capacity = toInt(strVal);
    }
    return this.capacity;
  }

};

export { MTierDef };
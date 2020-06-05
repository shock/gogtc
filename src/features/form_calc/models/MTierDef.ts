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

  troopPercentSumOver():boolean {
    return this.troopPercentSum() > 100;
  }

  troopPercentSumUnder():boolean {
    return this.troopPercentSum() < 100;
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

  updateTroopDefPercent(troopDef:MTroopDef, newPercent:number) {
    // update the troopDef's percent regardless of whether it's locked or now
    troopDef.updatePercent(newPercent);

    //
    // now we need to adjust the other troopDefs' percents relative to this one's change
    //
    const oldPercent = troopDef.percent;

    const percentDiff10k = (newPercent*10000) - (oldPercent*10000); // multiple by 10k for 4 decimal precision

    const otherTroopDefs = this.troopDefs.filter( tmpTroopDef => (troopDef !== tmpTroopDef) && (tmpTroopDef.percentLocked === false) )
    if( otherTroopDefs.length > 0 ) {
      if( otherTroopDefs.length === 1 ) {
        const otherTroopDef = otherTroopDefs[0];
        otherTroopDef.updatePercent( (otherTroopDef.percent*10000 - percentDiff10k) / 10000 );
      } else {
        // there are 2 other unlocked troopDefs
        const otd0 = otherTroopDefs[0];
        const otd1 = otherTroopDefs[1];
        const otdPercentSum = (otd0.percent * 10000) + (otd1.percent*10000);
        const otd0ratio = otd0.percent * 10000 / otdPercentSum;
        const otd1ratio = otd1.percent * 10000 / otdPercentSum;
        otd0.updatePercent(otd0ratio*percentDiff10k/10000);
        otd1.updatePercent(otd1ratio*percentDiff10k/10000);
      }
    }
  }

  calculateAndUpdatePercent(marchCap:Int) {
    if(marchCap === 0 || this.capacityLocked) {
      this.percent = 0;
    } else {
      const strVal = (Math.round(this.capacity * 1000000 / marchCap) / 10000).toFixed(4);
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
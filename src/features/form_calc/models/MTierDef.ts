import { Big } from 'big.js';

import { TierNum, TroopType, toInt, toBig } from '../types';
import { MTroopDef } from '.';

const PercentPrecision = 20;
// const PercentDeltaEpsilon = toBig(parseFloat((0.1**(PercentPrecision+1)).toFixed(PercentPrecision+1)));
const PercentDeltaEpsilon = 0;

class MTierDef {
  tierNum: TierNum;
  troopDefs: MTroopDef[] = [];
  capacity:Big = toBig(0);
  percent:Big = toBig(0);
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

  findTroopDef( troopType: TroopType ) {

    const selected = this.troopDefs.find( troopDef => troopDef.type === troopType );
    if( selected === undefined )
      throw new Error(`could not find MTroopDef with type ==${troopType}`)
    return selected;
  }

  /*
    COMPUTATION FUNCTIONS
  */

  getActualTroopDefPercentSum() {
    let sum = toInt(0);
    this.troopDefs.forEach( troopDef => {
      sum = sum.plus(troopDef.getActualPercent(this.capacity))
    })
    return sum;
  }


  // gets the tier cap using the existing troop def counts
  // does not set this.capacity
  getCapFromTroopDefs() {
    let capacity = toInt(0);
    this.troopDefs.forEach( troopDef => {
      capacity = capacity.plus(troopDef.count);
    });
    return toInt(capacity);
  }

  updateCap(capacity:Big) {
    if( this.percentLocked ) return;
    const max = toInt(99999999);
    const zero = toInt(0);
    if( capacity.gt(max) ) { capacity = max; };
    if( capacity.lt(zero) ) { capacity = zero; };
    this.capacity = capacity;
  }

  updatePercent(percent:Big) {
    if( this.capacityLocked ) return;
    const max = toInt(100);
    const zero = toInt(0);
    if( percent.gt(max) ) { percent = max; };
    if( percent.lt(zero) ) { percent = zero; };
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

  getLockedTroopCount():Big {
    let lockedCount:Big = toInt(0);
    this.troopDefs.forEach( troopDef => {
      if( troopDef.countLocked ) {
        lockedCount = lockedCount.plus(troopDef.count);
      }
    });
    return lockedCount;
  }

  getUnlockedCapacity():Big {
    return this.capacity.minus(this.getLockedTroopCount());
  }

  troopPercentSum():Big {
    let sum = toInt(0);
    this.troopDefs.forEach( troopDef => sum = sum.plus(troopDef.percent) );
    return sum;
  }

  troopPercentDelta() {
    return this.troopPercentSum().minus(toInt(100));;
  }

  hasTroopPercentDelta() {
    return this.troopPercentDelta().abs().gt(PercentDeltaEpsilon);
  }

  fixTroopPercent(troopDef:MTroopDef) {
    let newPercent = troopDef.percent.minus(this.troopPercentDelta());
    const hundred = toBig(100);
    const zero = toBig(0);
    if( newPercent.lt(zero) ) { newPercent = zero; }
    if( newPercent.gt(hundred) ) { newPercent = hundred; }
    troopDef.percent = newPercent;
  }

  getLockedTroopPercent():Big {
    let lockedPercent = toBig(0);
    this.troopDefs.forEach( troopDef => {
      if( troopDef.percentLocked ) {
        lockedPercent = lockedPercent.plus(troopDef.percent);
      }
    });
    return lockedPercent;
  }

  getUnlockedPercent():Big {
    return toBig(100).minus(this.getLockedTroopPercent());
  }

  calculateAndUpdateTroopPercents(fixDelta:boolean = true) {
    this.troopDefs.forEach( troopDef => {
      troopDef.calculateAndUpdatePercent(this.getUnlockedCapacity());
    });
    if( fixDelta && this.hasTroopPercentDelta() ) {
      let firstUnlockedTroopDef:MTroopDef|null = null;
      for( let i=0; i<this.troopDefs.length; i++ ) {
        if( !this.troopDefs[i].countLocked ) {
          firstUnlockedTroopDef = this.troopDefs[i];
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

  calculateAndUpdatePercent(marchCap:Big) {
    if((marchCap.eq(0)) || this.capacityLocked) {
      this.percent = toBig(0);
    } else {
      // const strVal = (Math.round(this.capacity * (10**(PercentPrecision+2)) / marchCap) / (10**PercentPrecision)).toFixed(PercentPrecision);
      this.percent = this.capacity.times(100).div(marchCap).round(PercentPrecision);
    }
    return this.percent;
  }

  calculateAndUpdateCap(marchCap:Big) {
    if( !this.capacityLocked ) {
      this.capacity = this.percent.times(marchCap).div(100).round();
    }
    return this.capacity;
  }

};

export { MTierDef };
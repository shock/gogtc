import { Big } from 'big.js';

import { TierNum, TroopType, toInt, toBig } from '../types';
import { MTroopDef } from '.';
import config from '../../../config';

// const PercentDeltaEpsilon = toBig('0.001');
const PercentDeltaEpsilon = toBig(0.1).pow(config.viewPrecision);

class MTierDef {
  tierNum: TierNum;
  troopDefs: MTroopDef[] = [];
  capacity:Big = toBig(0);
  percent:Big = toBig(0);
  capacityLocked:boolean = false;

  constructor(tierNum:TierNum) {
    this.tierNum = tierNum;
  }

  clone():MTierDef {
    const clone = new MTierDef(this.tierNum);
    clone.troopDefs = this.troopDefs.map( troopDef => {
      return troopDef.clone();
    });
    clone.capacity = this.capacity;
    clone.percent = this.percent;
    clone.capacityLocked = this.capacityLocked;
    return clone;
  }

  asJsonObject() {
    let obj:any = {};
    obj.tierNum = this.tierNum;
    obj.capacity = this.capacity;
    obj.percent = this.percent;
    obj.capacityLocked = this.capacityLocked;
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

  fixTroopPercent(troopDef:MTroopDef, delta:Big) {
    let newPercent = troopDef.percent.minus(delta);
    const hundred = toBig(100);
    const zero = toBig(0);
    if( newPercent.lt(zero) ) { newPercent = zero; }
    if( newPercent.gt(hundred) ) { newPercent = hundred; }
    troopDef.percent = newPercent;
  }

  calculateAndUpdateTroopPercents(fixDelta:boolean = true) {
    this.troopDefs.forEach( troopDef => {
      troopDef.calculateAndUpdatePercent(this.getUnlockedCapacity());
    });
    if( fixDelta && this.hasTroopPercentDelta() ) {
      let unlockedTroopDefs = this.troopDefs.filter( troopDef => {
        return !troopDef.countLocked;
      });
      const firstUnlockedTierDef = unlockedTroopDefs[0];
      if( firstUnlockedTierDef ) {
        const initialDelta = this.troopPercentDelta();
        const partialDelta = initialDelta.div(unlockedTroopDefs.length);
        unlockedTroopDefs.forEach( troopDef => {
          this.fixTroopPercent(troopDef, partialDelta);
        })
        this.fixTroopPercent(firstUnlockedTierDef, this.troopPercentDelta());
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
      this.percent = this.capacity.times(100).div(marchCap);
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
import { Big } from 'big.js';
import { toInt, toBig, TroopType } from '../types';

const PercentPrecision = 20;

export class MTroopDef {
  type: TroopType;
  count: Big;
  percent: Big;
  percentLocked: boolean;
  countLocked: boolean;

  constructor(type:TroopType, count:Big) {
    this.type = type;
    this.count = count;
    this.percent = toBig(0);
    this.percentLocked = false;
    this.countLocked = false;
  }

  asJsonObject() {
    let obj:any = {};
    obj.type = this.type;
    obj.count = this.count;
    obj.percent = this.percent;
    obj.countLocked = this.countLocked;
    obj.percentLocked = this.percentLocked;
    return obj;
  }

  lockCount() {
    if(this.countLocked) return;
    if(this.percentLocked)
      this.percentLocked = false;
    this.countLocked = true;
  }

  // updates the count unless the percentage is locked
  updateCount(value: Big) {
    if(this.percentLocked) return;
    let count = value;
    const max = toInt(99999999);
    const zero = toInt(0);
    if( count.gt(max) ) { count = max; };
    if( count.lt(zero) ) { count = zero; };
    this.count = count;
  }

  // updates the percentage unless the count is locked
  updatePercent(value: Big) {
    if(this.countLocked) return;
    let percent = value;
    const hundred = toInt(100);
    const zero = toInt(0);
    if( percent.gt(hundred) ) {
      percent = hundred;
    }
    if( percent.lt(zero) ) {
      percent = zero;
    }
    this.percent = percent;
  }

  updateCountLock(state: boolean) {
    this.countLocked = state;
    this.percentLocked = this.percentLocked && !this.countLocked;
  }

  updatePercentLock(state: boolean) {
    this.percentLocked = state;
    this.countLocked = this.countLocked && !this.percentLocked;
  }

  // calculates the percentage of this troopDefs's count of the supplied tier capcity
  // if countLocked is true, the calculation is always zero
  // the troopDefs's percent attribute is updated withe calculated value and returned
  calculateAndUpdatePercent(tierCapacity:Big) {
    if( this.percentLocked ) return this.percent;
    if(tierCapacity.eq(0) || this.countLocked) {
      this.percent = toBig(0);
    } else {
      // const strVal = (Math.round(this.count * (10**(PercentPrecision+2)) / tierCapacity) / (10**PercentPrecision)).toFixed(PercentPrecision);
      this.percent = this.count.times(100).div(tierCapacity).round(PercentPrecision);
    }
    return this.percent;
  }

  // returns the actual percent of the supplied tierCapacity for this troopDef's count
  // no attribute are mutated
  getActualPercent(tierCapacity:Big):Big {
    return this.count.div(tierCapacity);
  }

  calculateAndUpdateCount(capacity:Big) {
    if( !this.countLocked ) {
      this.count = this.percent.times(capacity).div(100).round();
    }
    return this.count;
  }

};
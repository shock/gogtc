import { Int, toInt, TroopType } from '../types';
import { MTierDef } from '.';

export class MTroopDef {
  type: TroopType;
  count: Int;
  percent: number;
  percentLocked: boolean;
  countLocked: boolean;

  constructor(type:TroopType, count:Int) {
    this.type = type;
    this.count = count;
    this.percent = 0;
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
  updateCount(value: any) {
    if(this.percentLocked) return;
    let count = toInt(value);
    if( count > 999999 ) { count = toInt(999999); };
    this.count = count;
  }

  // updates the percentage unless the count is locked
  updatePercent(value: any) {
    if(this.countLocked) return;
    let percent = parseFloat(''+value);
    if( percent > 100 ) { percent = 100; }
    if( percent < 0 ) { percent = 0; }
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
  calculateAndUpdatePercent(tierCapacity:Int) {
    if( this.percentLocked ) return this.percent;
    if(tierCapacity === 0 || this.countLocked) {
      this.percent = 0;
    } else {
      const strVal = (Math.round(this.count * 100000 / tierCapacity) / 1000).toFixed(4);
      this.percent = parseFloat(strVal);
    }
    return this.percent;
  }

  // returns the actual percent of the supplied tierCapacity for this troopDef's count
  // no attribute are mutated
  getActualPercent(tierCapacity:Int):number {
    const strVal = (Math.round(this.count * 100000 / tierCapacity) / 1000).toFixed(4);
    return parseFloat(strVal);
  }

  calculateAndUpdateCount(capacity:Int) {
    if( !this.countLocked ) {
      const strVal = Math.round(this.percent * capacity / 100);
      this.count = toInt(strVal);
    }
    return this.count;
  }

};
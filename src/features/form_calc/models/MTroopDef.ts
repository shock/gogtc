import { Int, toInt, TroopType } from '../types';
import { MTierDef } from '.';

export class MTroopDef {
  tierDef: MTierDef | null = null;
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

  id():string {
    if ( !this.tierDef )
      throw new Error('attribute tierDef is null');
    return `${this.tierDef.id()}:${this.type}`;
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
    this.percent = percent;
  }

  calculateAndUpdatePercent(capacity:Int) {
    const strVal = (Math.round(this.count * 1000000 / capacity) / 10000).toFixed(4);
    this.percent = parseFloat(strVal);
  }

  calculateAndUpdateCount(capacity:Int) {
    const strVal = Math.round(this.percent * capacity / 100);
    this.count = toInt(strVal);
  }

};
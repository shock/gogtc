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
  setCount(value: any) {
    if(this.percentLocked) return;
    this.count = toInt(value);
  }

  // updates the percentage unless the count is locked
  setPercent(value: any) {
    if(this.countLocked) return;
    this.percent = parseFloat(''+value);
  }

};
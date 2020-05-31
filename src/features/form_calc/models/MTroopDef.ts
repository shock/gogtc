import { Int, TroopType } from '../types';
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

  setCount(value: any) {
    this.count = parseInt(''+value) as Int;
  }

  setPercent(value: any) {
    this.percent = parseFloat(''+value);
  }

};
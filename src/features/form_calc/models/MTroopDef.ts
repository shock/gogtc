import { Int, NumEntry, TroopType } from '../types';
import { MTierDef } from '.';

class MTroopDef {
  tierDef: MTierDef | null = null;
  type: TroopType;
  count: Int;

  constructor(type:TroopType, count:Int) {
    this.type = type;
    this.count = count;
  }

  id():string {
    if ( !this.tierDef )
      throw new Error('attribute tierDef is null');
    return `${this.tierDef.id()}:${this.type}`;
  }

  getNumEntry():NumEntry {
    return {
      id: this.id(),
      value: this.count.toString(),
      label: this.type
    }
  };
};

export { MTroopDef };
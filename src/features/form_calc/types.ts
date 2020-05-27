// Redux Types

export type NumEntry = {
  id: string;
  value: string;
  label: string;
}

export type KeyedNumEntry = {
  [key: string]: NumEntry
}

export type NumEntryDictionary = {
  numEntries: KeyedNumEntry
}

// Model Types

// https://spin.atomicobject.com/2018/11/05/using-an-int-type-in-typescript/
export type Int = number & { __int__: void };
export type Percentage = number;

export enum TierNum {
  T1 = 1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
}

export enum TroopType {
  Infantry = "Infantry",
  Cavalry = "Cavalry",
  Distance = "Distance",
  Artillery = "Artillery"
}

export class TroopDef {
  type: TroopType;
  tierNum: TierNum;
  count: Int;

  constructor(type:TroopType, tierNum:TierNum, count:Int) {
    this.type = type;
    this.tierNum = tierNum;
    this.count = count;
  }

  id():string {
    return `${this.tierNum}.${this.type}`;
  }
}

export class TierDef {
  tierNum: TierNum;
  troopDefs: TroopDef[];

  constructor(tierNum:TierNum, troopDefs: TroopDef[]) {
    this.tierNum = tierNum;
    this.troopDefs = troopDefs;
  }
}

export class FormCalc {
  name: string;
  tierDefs: TierDef[];

  constructor(name:string, tierDefs:TierDef[]) {
    this.name = name;
    this.tierDefs = tierDefs;
  }
}
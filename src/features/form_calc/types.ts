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
  formCalc: FormCalc | null = null;
  type: TroopType;
  tierNum: TierNum;
  count: Int;

  constructor(type:TroopType, tierNum:TierNum, count:Int) {
    this.type = type;
    this.tierNum = tierNum;
    this.count = count;
  }

  id():string {
    if ( !this.formCalc )
      throw new Error('attribute formCalc is null');
    return `${this.formCalc.name}:${this.tierNum}:${this.type}`;
  }
}

export class TierDef {
  formCalc: FormCalc | null = null;
  tierNum: TierNum;
  troopDefs: TroopDef[] = [];

  constructor(tierNum:TierNum) {
    this.tierNum = tierNum;
  }

  addTroopDef(troopDef: TroopDef) {
    this.troopDefs.push(troopDef);
  }

  setTroopDefs(troopDefs: TroopDef[]) {
    this.troopDefs = troopDefs;
  }
}

export class FormCalc {
  name: string;
  tierDefs: TierDef[] = [];

  constructor(name:string) {
    this.name = name;
  }

  addTierDefs(tierDefs: TierDef[]) {
    this.tierDefs = tierDefs;
  }

  setTierDefs(tierDef: TierDef) {
    this.tierDefs.push(tierDef);
  }
}
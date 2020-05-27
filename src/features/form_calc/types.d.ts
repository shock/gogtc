declare module 'FormCalc' {
  export type NumEntry = {
    id: string;
    value: string;
    label: string;
  }

  export type KeyedNumEntry = {
    [key: string]: NumEntry
  }

  export type FormCalc = {
    numEntries: KeyedNumEntry
  }

  // https://spin.atomicobject.com/2018/11/05/using-an-int-type-in-typescript/
  export type Int = number & { __int__: void };
  export type Percentage = Big;

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
    Infantry = "INFANTRY",
    Cavalry = "CAVALRY",
    Distance = "DISTANCE",
    Artillery = "ARTILLERY"
  }

  export type TroopDef = {
    type: TroopType;
    tierNum: TierNum;
    count: Int;
  }
}

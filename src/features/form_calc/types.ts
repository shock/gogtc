// Redux Types

export type IdValue = {
  id: string,
  value: string
}

// Model Types

// https://spin.atomicobject.com/2018/11/05/using-an-int-type-in-typescript/
export type Int = number & { __int__: void };
export const roundToInt = (num: number): Int => Math.round(num) as Int;
export const toInt = (value:any) => (parseInt(''+value) as Int);
export type Percentage = number;

export enum TierNum {
  T12 = 'T12',
  T11 = 'T11',
  T10 = 'T10',
  T9 = 'T9',
  T8 = 'T8',
  T7 = 'T7',
  T6 = 'T6',
  T5 = 'T5',
  T4 = 'T4',
  T3 = 'T3',
  T2 = 'T2',
  T1 = 'T1',
}

export enum TroopType {
  Infantry = "Infantry",
  Cavalry = "Cavalry",
  Distance = "Distance",
  Artillery = "Artillery"
}
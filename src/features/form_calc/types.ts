import { Big } from 'big.js';

// Redux Types

export type IdString = {
  id: string,
  value: string
}

export type IdBoolean = {
  id: string,
  boolean: boolean
}

export type IdOnly = {
  id: string
}

// Model Types

// https://spin.atomicobject.com/2018/11/05/using-an-int-type-in-typescript/
export const toInt = (value:any) => {
  let num = parseFloat(value);
  if( isNaN(num) ) { num = 0 }
  return new Big(num).round()
};
export const toBig = (value:any) => {
  let num = parseFloat(value);
  if( isNaN(num) ) { num = 0 }
  return new Big(num)
};

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

export const TiersDescending = [
  TierNum.T12,
  TierNum.T11,
  TierNum.T10,
  TierNum.T9,
  TierNum.T8,
  TierNum.T7,
  TierNum.T6,
  TierNum.T5,
  TierNum.T4,
  TierNum.T3,
  TierNum.T2,
  TierNum.T1,
]

export enum TroopType {
  Infantry = "Infantry",
  Cavalry = "Cavalry",
  Distance = "Distance",
  Artillery = "Artillery"
}

export const TroopTypes = [
  TroopType.Infantry,
  TroopType.Cavalry,
  TroopType.Distance
]
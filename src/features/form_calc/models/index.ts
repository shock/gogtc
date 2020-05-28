import { MFormCalc } from './MFormCalc';
import { MTierDef } from './MTierDef';
import { MTroopDef } from './MTroopDef';
import { TierNum } from '../types';

let fc1 = new MFormCalc('fc1');
let tierDef = new MTierDef(fc1, TierNum.T12)

export const Library = {
  formCalcModels: {
    'fc1': fc1
  }
};

export * from './MTierDef';
export * from './MTroopDef';
export * from './MFormCalc'
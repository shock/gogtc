import { MFormCalc, MTierDef, MTroopDef } from '.';
import { TierNum, TroopType, Int } from '../types';

function buildTroopDefs(tierDef:MTierDef):MTroopDef[] {
  const troopDefs =  [
    new MTroopDef(
      TroopType.Infantry,
      1000 as Int,
    ),
    new MTroopDef(
      TroopType.Cavalry,
      2000 as Int,
    ),
    new MTroopDef(
      TroopType.Distance,
      3000 as Int,
    ),
  ];
  troopDefs.forEach( (troopDef) => {
    troopDef.tierDef = tierDef;
  });
  return troopDefs;
}

function buildTierDefWithTroopDefs(tierNum:TierNum, formCalc:MFormCalc):MTierDef {
  let tierDef = new MTierDef(tierNum);
  tierDef.troopDefs = buildTroopDefs(tierDef);
  tierDef.formCalc = formCalc;
  return tierDef;
}

function buildFormCalc(name:string) {
  const formCalc = new MFormCalc(name);
  let tierDefs:MTierDef[] = [];
  for (const tierNum in TierNum) {
    tierDefs.push(buildTierDefWithTroopDefs(tierNum as TierNum, formCalc));
  }
  formCalc.tierDefs = tierDefs;
  return formCalc;
}

export type FormCalcDictionary = {
  [key: string]: MFormCalc
}

export const TestLibrary = {
  formCalcModels: {
    test: buildFormCalc('test'),
    fc1: buildFormCalc('fc1')
  } as FormCalcDictionary
};

export * from './MTierDef';
export * from './MTroopDef';
export * from './MFormCalc'
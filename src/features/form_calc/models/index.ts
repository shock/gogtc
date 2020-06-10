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
  // troopDefs.forEach( (troopDef) => {
  //   troopDef.tierDef = tierDef;
  // });
  return troopDefs;
}

function buildTierDefWithTroopDefs(tierNum:TierNum, formCalc:MFormCalc):MTierDef {
  let tierDef = new MTierDef(tierNum);
  tierDef.troopDefs = buildTroopDefs(tierDef);
  // tierDef.formCalc = formCalc;
  return tierDef;
}

function buildFormCalc(name:string) {
  const formCalc = new MFormCalc(name);
  let tierDefs:MTierDef[] = [];
  for (const tierNum in TierNum) {
    tierDefs.push(buildTierDefWithTroopDefs(tierNum as TierNum, formCalc));
  }
  formCalc.tierDefs = tierDefs;
  formCalc.updatePercentsFromCounts();
  return formCalc;
}

export type FormCalcDictionary = {
  formCalcs: {[key: string]: MFormCalc}
}

export type TierDefDictionary = {
  tierDefs: {[key: string]: MTierDef}
}

export type TroopDefDictionary = {
  troopDefs: {[key: string]: MTroopDef}
}

export type FCState = FormCalcDictionary & TierDefDictionary & TroopDefDictionary;

export const BlankFCState:FCState = {
  formCalcs: {},
  tierDefs: {},
  troopDefs: {}
}

export const TestLibrary:FormCalcDictionary = {
  formCalcs: {
    test: buildFormCalc('test'),
    fc1: buildFormCalc('fc1')
  }
};

export * from './MTierDef';
export * from './MTroopDef';
export * from './MFormCalc';

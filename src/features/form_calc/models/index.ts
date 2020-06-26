import { MFormCalc, MTierDef, MTroopDef } from '.';
import { TierNum, TroopType, toBig } from '../types';

function buildTroopDefs(tierDef:MTierDef):MTroopDef[] {
  const troopDefs =  [
    new MTroopDef(
      TroopType.Infantry,
      toBig(2000),
    ),
    new MTroopDef(
      TroopType.Cavalry,
      toBig(4000),
    ),
    new MTroopDef(
      TroopType.Distance,
      toBig(6000),
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
  formCalc.updateMarchCap(formCalc.getCapFromTierDefs());
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

const test = buildFormCalc('test')
const fc1 = buildFormCalc('fc1')
const formCalcs:{[key:string]: MFormCalc} = {}
formCalcs[fc1.id] = fc1
formCalcs[test.id] = test

export const TestLibrary:FormCalcDictionary = {
  formCalcs: formCalcs
};

export * from './MTierDef';
export * from './MTroopDef';
export * from './MFormCalc';

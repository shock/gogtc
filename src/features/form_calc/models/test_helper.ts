import { MTierDef, MTroopDef, MFormCalc } from '.';
import { TroopType, TierNum, Int } from '../types';
import formCalcReducer from '../reducer';

export function buildTierDef(tierNum:TierNum, formCalc:MFormCalc = new MFormCalc('test')) {
  let instance = new MTierDef(tierNum);
  instance.formCalc = formCalc;
  return instance;
}

export function buildTroopDef(type:TroopType, count:Int, tierDef:MTierDef = buildTierDef(TierNum.T12)) {
  const instance = new MTroopDef(type, count);
  instance.tierDef = tierDef;
  return instance;
}

export function buildTroopDefs(tierDef:MTierDef):MTroopDef[] {
  const troopDefs =  [
    buildTroopDef(
      TroopType.Infantry,
      1000 as Int,
      tierDef
    ),
    buildTroopDef(
      TroopType.Cavalry,
      2000 as Int,
      tierDef
    ),
    buildTroopDef(
      TroopType.Distance,
      3000 as Int,
      tierDef
    ),
  ];
  return troopDefs;
}

export function buildTierWithTroopDefs(tierNum:TierNum, formCalc:MFormCalc = new MFormCalc('test') ):MTierDef {
  let tierDef = new MTierDef(tierNum);
  tierDef.troopDefs = buildTroopDefs(tierDef);
  tierDef.formCalc = formCalc;
  return tierDef;
}

export function buildFormCalcWithTiers(name:string = 'test') {
  const formCalc = new MFormCalc(name);
  const tierDefs = [
    buildTierWithTroopDefs(TierNum.T12, formCalc),
    buildTierWithTroopDefs(TierNum.T11, formCalc)
  ];
  formCalc.tierDefs = tierDefs;
  return formCalc;
}
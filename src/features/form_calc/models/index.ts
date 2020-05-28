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

function buildWithTroopDefs(tierNum:TierNum):MFormCalc {
  const formCalc = new MFormCalc('test');
  let tierDef = new MTierDef(tierNum);
  tierDef.troopDefs = buildTroopDefs(tierDef);
  tierDef.formCalc = formCalc;
  formCalc.tierDefs = [tierDef];
  return formCalc;
}

export const Library = {
  formCalcModels: {
    test: buildWithTroopDefs(TierNum.T12)
  }
};

export * from './MTierDef';
export * from './MTroopDef';
export * from './MFormCalc'
import { Big } from 'big.js'
import { toInt } from '../../../lib/fixed-point'

import { MTierDef, MTroopDef, MFormCalc } from '../models'
import { TroopType, TierNum} from '../../../lib/fc-types'

export function buildTierDef(tierNum:TierNum, formCalc:MFormCalc = new MFormCalc('test')) {
  let instance = new MTierDef(tierNum)
  // instance.formCalc = formCalc
  return instance
}

export function buildTroopDef(type:TroopType, count:Big, tierDef:MTierDef = buildTierDef(TierNum.T12)) {
  const instance = new MTroopDef(type, count)
  // instance.tierDef = tierDef
  return instance
}

export function buildTroopDefs(tierDef:MTierDef):MTroopDef[] {
  const troopDefs =  [
    buildTroopDef(
      TroopType.Infantry,
      toInt(1000),
      tierDef
    ),
    buildTroopDef(
      TroopType.Cavalry,
      toInt(2000),
      tierDef
    ),
    buildTroopDef(
      TroopType.Distance,
      toInt(3000),
      tierDef
    ),
  ]
  return troopDefs
}

export function buildTierWithTroopDefs(tierNum:TierNum, formCalc:MFormCalc = new MFormCalc('test') ):MTierDef {
  let tierDef = new MTierDef(tierNum)
  tierDef.troopDefs = buildTroopDefs(tierDef)
  // tierDef.formCalc = formCalc
  return tierDef
}

export function buildFormCalcWithTiers(name:string = 'test') {
  const formCalc = new MFormCalc(name)
  const tierDefs = [
    buildTierWithTroopDefs(TierNum.T12, formCalc),
    buildTierWithTroopDefs(TierNum.T11, formCalc)
  ]
  formCalc.tierDefs = tierDefs
  return formCalc
}
import { MFormCalc } from './MFormCalc'
import { MTierDef } from './MTierDef'
import { MTroopDef } from './MTroopDef'
import { TroopData } from './TroopData'
import { TierNum, TroopType } from '../../../lib/fc-types'
import { toBig } from '../../../lib/fixed-point'

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
  ]
  return troopDefs
}

function buildTierDefWithTroopDefs(tierNum:TierNum, formCalc:MFormCalc):MTierDef {
  let tierDef = new MTierDef(tierNum)
  tierDef.troopDefs = buildTroopDefs(tierDef)
  // tierDef.formCalc = formCalc
  return tierDef
}

function buildFormCalc(name:string) {
  const formCalc = new MFormCalc(name)
  let tierDefs:MTierDef[] = []
  for (const tierNum in TierNum) {
    tierDefs.push(buildTierDefWithTroopDefs(tierNum as TierNum, formCalc))
  }
  formCalc.tierDefs = tierDefs
  formCalc.updateMarchCap(formCalc.getCapFromTierDefs())
  formCalc.updatePercentsFromCounts()
  return formCalc
}

export type FormCalcDictionary = {
  formCalcs: {[key: string]: MFormCalc}
}

export type FCState = FormCalcDictionary & {
  currentId: string
}

export const BlankFCState:FCState = {
  formCalcs: {},
  currentId: ''
}

const test = buildFormCalc('test')
const fc1 = buildFormCalc('fc1')
const formCalcs:{[key:string]: MFormCalc} = {}
formCalcs[fc1.id] = fc1
formCalcs[test.id] = test

export const TestLibrary:FormCalcDictionary = {
  formCalcs: formCalcs
}

export { MTierDef, MTroopDef, MFormCalc, TroopData }

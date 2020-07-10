import cuid from 'cuid'
import { getTierNum, getTroopType } from '../lib/IdParser'
import { Big } from 'big.js'
import MBase from '../../../lib/models/MBase'
import { MTierDef, MTroopDef } from '.'
import { TierNum } from '../../../lib/fc-types'
import { TroopType, TroopTypes } from '../../../lib/fc-types'
import { toInt, toBig } from '../../../lib/fixed-point'
import { IdString, IdBoolean, IdOnly } from '../../../lib/action_types'
import config from '../../../config'
import { AnyAction } from 'redux'

const PercentDeltaEpsilon = toBig(0.1).pow(config.viewPrecision)

class MFormCalc extends MBase {
  name: string
  tierDefs: MTierDef[] = []
  marchCap:Big = toInt(0)
  id:string = cuid()
  persisted:boolean = false
  preset:boolean = false

  constructor(name:string, marchCap:Big = toInt(0), preset:boolean = false) {
    super()
    this.name = name
    this.marchCap = toInt(marchCap)
    this.preset = preset || false
  }

  clone():MFormCalc {
    const clone = new MFormCalc(this.name, this.marchCap, this.preset)
    clone.tierDefs = this.tierDefs.map( tierDef => {
      return tierDef.clone()
    })
    clone.changed = this.changed
    clone.persisted = this.persisted
    clone.id = this.id
    clone.key = this.key
    return clone
  }

  isChanged() {
    let isChanged = super.isChanged()
    this.tierDefs.forEach( td => { isChanged = isChanged || td.isChanged() })
    return isChanged
  }

  clearChanged() {
    super.clearChanged()
    this.tierDefs.forEach(td => td.clearChanged())
  }

  objectForState() {
    return this
  }

  toJsonObject() {
    let obj:any = {}
    obj.name = this.name
    obj.id = this.id
    obj.marchCap = this.marchCap
    obj.preset = this.preset
    obj.tierDefs = this.tierDefs.map( tierDef => {
      return tierDef.toJsonObject()
    })
    return obj
  }

  static fromJsonObject(obj:AnyAction) {
    ['name', 'marchCap'].forEach( prop => {
      if( !obj.hasOwnProperty(prop) ) {
        throw new Error(`must have property: ${prop}`)
      }
    })

    const formCalc = new MFormCalc( obj.name, obj.marchCap, obj.preset )
    formCalc.id = obj.id

    const objTierDefs = obj.tierDefs
    if( objTierDefs && (objTierDefs instanceof Array)) {
      const tierDefs:MTierDef[] = objTierDefs.map( (tdObj) => (
        MTierDef.fromJsonObject(tdObj)
      ))
      formCalc.tierDefs = tierDefs
    }
    return formCalc
  }

  findTierDef(id: string) {
    const tierNum = getTierNum(id)
    const selected = this.tierDefs.find( tierDef => tierDef.tierNum === tierNum )
    if( selected === undefined )
      throw new Error(`could not find MTierDef with tierNum ==${tierNum}`)
    return selected
  }

  findTroopDef(id: string) {
    const tierDef = this.findTierDef(id)
    const troopType = getTroopType(id)
    return tierDef.findTroopDef(troopType)
  }

  getTroopDefs():MTroopDef[] {
    let troopDefs:MTroopDef[] = []
    this.tierDefs.forEach( (tierDef) => {
      troopDefs = troopDefs.concat(tierDef.troopDefs)
    })
    return troopDefs
  }

  getTierDefs():MTierDef[] {
    return this.tierDefs
  }

  ////////////////////
  // ACTION HANDLERS
  ////////////////////

  // Handles simple change to name
  updateNameHandler(payload:IdString) {
    this.updateName(payload.value)
    return this.objectForState()
  }

  // Handles simple change to name
  updatePresetFlagHandler(payload:IdBoolean) {
    this.updatePresetFlag(payload.boolean)
    return this.objectForState()
  }

  // Handles change to main march cap.
  // should update entire formation based on new march cap
  updateMarchCapHandler(payload:IdString) {
    this.updateMarchCap(toInt(payload.value))
    this.updateCountsFromPercents()
    return this.objectForState()
  }

  // Updates the tier percent and corespondingly the troop defs' counts
  // and the tier cap
  updateTierPercentHandler(payload:IdString) {
    const tierDef = this.findTierDef(payload.id)
    tierDef.updatePercent(toBig(payload.value))
    this.updateCountsFromPercents()
    return this.objectForState()
  }

  // Updates an individual troop def's count
  // if the troop def's count is not locked, updates the unlocked troop def percentages
  // without changing the sibling troop def counts
  updateTroopCountHandler(payload:IdString) {
    const troopDef = this.findTroopDef(payload.id)
    troopDef.updateCount(toBig(payload.value))
    this.updateMarchCap(this.getCapFromTierDefs())
    this.updatePercentsFromCounts()
    return this.objectForState()
  }

  // updates the troop def percentage if it's not count-locked
  // updates the troop count accordingly which, in turn, updates the tier defs' cap
  updateTroopPercentHandler(payload:IdString) {
    const troopDef = this.findTroopDef(payload.id)
    troopDef.updatePercent(toBig(payload.value))
    this.updateCountsFromPercents()
    return this.objectForState()
  }

  updateTroopCountLockHandler(payload:IdBoolean) {
    const troopDef = this.findTroopDef(payload.id)
    troopDef.updateCountLock(payload.boolean)
    this.resolveLockStates()
    this.updatePercentsFromCounts()
    return this.objectForState()
  }

  updateTierCapacityLockHandler(payload:IdBoolean) {
    const tierDef = this.findTierDef(payload.id)
    tierDef.updateCapacityLock(payload.boolean)
    this.resolveLockStates()
    this.updatePercentsFromCounts()
    return this.objectForState()
  }

  fixTroopPercentHandler(payload:IdOnly) {
    const tierDef = this.findTierDef(payload.id)
    const troopDef = this.findTroopDef(payload.id)
    tierDef.fixTroopPercent(troopDef, tierDef.troopPercentDelta())
    this.updateCountsFromPercents()
    return this.objectForState()
  }

  fixTierPercentHandler(payload:IdOnly) {
    const tierDef = this.findTierDef(payload.id)
    this.fixTierPercent(tierDef, this.tierPercentDelta())
    this.updateCountsFromPercents()
    return this.objectForState()
  }

  /* selectors */

  getTroopDefsForType(type:TroopType) {
    return this.tierDefs.reduce((troopDefs, tierDef) => {
      const selected = tierDef.troopDefs.filter(troopDef => troopDef.type === type)
      troopDefs.push({tierNum:tierDef.tierNum, troopDef:selected[0]})
      return troopDefs
    }, [] as {tierNum:TierNum,troopDef:MTroopDef}[])
  }

  /*
    COMPUTATION FUNCTIONS
  */

  tierPercentSum():Big {
    let sum = toBig(0)
    this.tierDefs.forEach( tierDef => sum = sum.plus(tierDef.percent) )
    return sum
  }

  tierPercentDelta() {
    return this.tierPercentSum().minus(100)
  }

  hasTierPercentDelta() {
    return this.tierPercentDelta().abs().gt(PercentDeltaEpsilon)
  }

  // gets the tier cap using the existing troop def counts
  // does not change anything
  getCapFromTierDefs() {
    let marchCap = toInt(0)
    this.tierDefs.forEach( tierDef => {
      marchCap = marchCap.plus(tierDef.getCapFromTroopDefs())
    })
    return toInt(marchCap)
  }

  getActualTierPercent(tierDef:MTierDef) {
    const actualMarchCap = this.getCapFromTierDefs()
    if( actualMarchCap.eq(0) ) { return toBig(0) }
    return tierDef.capacity.times(100).div(actualMarchCap)
  }

  getLockedTierCap():Big {
    let lockedCap:Big = toInt(0)
    this.tierDefs.forEach( tierDef => {
      if( tierDef.capacityLocked ) {
        lockedCap = lockedCap.plus(tierDef.capacity)
      }
    })
    return lockedCap
  }

  getUnlockedCapacity():Big {
    return toInt(this.marchCap.minus(this.getLockedTierCap()))
  }

  // gets the sum of tier def percents
  // does not change anything
  getTierDefPercentsSum() {
    let sum = toInt(0)
    this.tierDefs.forEach( tierDef => {
      sum = sum.plus(tierDef.percent)
    })
    return sum
  }

  getCountForType(type:TroopType) {
    return this.tierDefs.reduce((sum, td) => {
      return sum.plus(td.getCountForType(type))
    }, toInt(0))
  }

  getPercentForType(type:TroopType) {
    const countForType = this.getCountForType(type)
    return countForType.times(100).div(this.marchCap)
  }

  getPowerForType(type:TroopType) {
    return this.tierDefs.reduce((sum, td) => {
      return sum.plus(td.getPowerForType(type))
    }, toInt(0))
  }

  collectAttributeForType(type:TroopType, attr:string) {
    return this.tierDefs.reduce((sum, td) => {
      return sum.plus(td.collectAttributeForType(type, attr))
    }, toInt(0))
  }

  collectAttribute(attr:string) {
    return TroopTypes.reduce((sum, type) => {
      return sum.plus(this.collectAttributeForType(type, attr))
    }, toInt(0))
  }

  updateMarchCap(marchCap:Big) {
    this.marchCap = marchCap
    this.markForUpdate()
  }

  resolveLockStates() {
    this.tierDefs.forEach( tierDef => {tierDef.resolveLockStates()} )
    this.markForUpdate()
  }

  fixTierPercent(tierDef:MTierDef, delta:Big) {
    let newPercent = tierDef.percent.minus(delta)
    const zero = toInt(0)
    const hundred = toInt(100)
    if( newPercent.lt(zero) ) { newPercent = zero }
    if( newPercent.gt(hundred) ) { newPercent = hundred }
    tierDef.percent = newPercent
    this.markForUpdate()
  }

  calculateAndUpdateTierPercents(fixDelta:boolean = true) {
    this.tierDefs.forEach( tierDef => {
      tierDef.calculateAndUpdatePercent(this.marchCap)
    })
    if( fixDelta && this.hasTierPercentDelta() ) {
      let unlockedTierDefs = this.tierDefs.filter( tierDef => {
        return !tierDef.capacityLocked
      })
      const firstUnlockedTierDef = unlockedTierDefs[0]
      if( firstUnlockedTierDef ) {
        const initialDelta = this.tierPercentDelta()
        const partialDelta = initialDelta.div(unlockedTierDefs.length)
        unlockedTierDefs.forEach( tierDef => {
          this.fixTierPercent(tierDef, partialDelta)
        })
        this.fixTierPercent(firstUnlockedTierDef, this.tierPercentDelta())
      }
    }
    this.markForUpdate()
  }

  updatePercentsFromCounts(fixPercent:boolean=true) {
    Big.DP = config.calcPrecision
    this.tierDefs.forEach( tierDef => {
      tierDef.updateCap( toInt(tierDef.getCapFromTroopDefs()) )
      tierDef.calculateAndUpdatePercent(this.marchCap)
      tierDef.calculateAndUpdateTroopPercents(true)
    })
    this.calculateAndUpdateTierPercents(fixPercent)
    this.markForUpdate()
  }

  updateTierPercentsFromCounts(fixPercent:boolean=true) {
    this.tierDefs.forEach( tierDef => {
      tierDef.updateCap( toInt(tierDef.getCapFromTroopDefs()) )
      tierDef.calculateAndUpdatePercent(this.marchCap)
    })
    this.calculateAndUpdateTierPercents(fixPercent)
    this.markForUpdate()
  }

  updateCountsFromPercents() {
    this.tierDefs.forEach( tierDef => {
      tierDef.calculateAndUpdateCap(this.getUnlockedCapacity())
      tierDef.calculateAndUpdateTroopCounts()
    })
    this.markForUpdate()
  }

  /////////////////////////////////
  // logicless setters

  updateName(name:string) {
    name = name.trim()
    if( this.name !== name ) {
      this.name = name
      this.markForUpdate()
    }
  }

  updatePresetFlag(preset:boolean) {
    if( this.preset !== preset ) {
      this.preset = preset
      this.markForUpdate()
    }
  }

}

export { MFormCalc }
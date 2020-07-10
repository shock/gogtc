import { Big } from 'big.js'

import { TierNum, TroopType } from '../../../lib/fc-types'
import { toInt, toBig } from '../../../lib/fixed-point'
import { MTroopDef, TroopData } from '.'
import config from '../../../config'
import MBase from '../../../lib/models/MBase'

const PercentDeltaEpsilon = toBig(0.1).pow(config.viewPrecision)

class MTierDef extends MBase {
  tierNum: TierNum
  troopDefs: MTroopDef[] = []
  capacity:Big = toBig(0)
  percent:Big = toBig(0)
  capacityLocked:boolean = false

  constructor(tierNum:TierNum, capacity:Big = toBig(0), percent:Big = toBig(0), capacityLocked:boolean = false) {
    super()
    this.tierNum = tierNum
    this.capacity = toInt(capacity)
    this.percent = toBig(percent)
    this.capacityLocked = capacityLocked
  }

  clone():MTierDef {
    const clone = new MTierDef(this.tierNum, this.capacity, this.percent, this.capacityLocked)
    clone.troopDefs = this.troopDefs.map( troopDef => {
      return troopDef.clone()
    })
    clone.changed = this.changed
    clone.key = this.key
    return clone
  }

  isChanged() {
    let isChanged = super.isChanged()
    this.troopDefs.forEach( td => { isChanged = isChanged || td.isChanged() })
    return isChanged
  }

  clearChanged() {
    super.clearChanged()
    this.troopDefs.forEach(td => td.clearChanged())
  }

  objectForState() {
    return this
  }

  toJsonObject() {
    let obj:any = {}
    obj.tierNum = this.tierNum
    obj.capacity = this.capacity
    obj.percent = this.percent
    obj.capacityLocked = this.capacityLocked
    obj.troopDefs = this.troopDefs.map( troopDef => {
      return troopDef.toJsonObject()
    })
    return obj
  }

  static fromJsonObject(obj:any) {
    ['tierNum', 'capacity', 'percent', 'capacityLocked'].forEach( prop => {
      if( !obj.hasOwnProperty(prop) ) {
        throw new Error(`must have property: ${prop}`)
      }
    })

    const tierDef = new MTierDef(
      obj.tierNum,
      obj.capacity,
      obj.percent,
      obj.capacityLocked
    )

    const objTroopDefs = obj.troopDefs
    if( objTroopDefs && (objTroopDefs instanceof Array)) {
      const troopDefs:MTroopDef[] = objTroopDefs.map( (tdObj) => (
        MTroopDef.fromJsonObject(tdObj)
      ))
      tierDef.troopDefs = troopDefs
    }
    return tierDef
  }

  findTroopDef( troopType: TroopType ) {

    const selected = this.troopDefs.find( troopDef => troopDef.type === troopType )
    if( selected === undefined )
      throw new Error(`could not find MTroopDef with type ==${troopType}`)
    return selected
  }

  /*
    COMPUTATION FUNCTIONS
  */

  getActualTroopDefPercentSum() {
    let sum = toInt(0)
    this.troopDefs.forEach( troopDef => {
      sum = sum.plus(troopDef.getActualPercent(this.capacity))
    })
    return sum
  }


  // gets the tier cap using the existing troop def counts
  // does not set this.capacity
  getCapFromTroopDefs() {
    let capacity = toInt(0)
    this.troopDefs.forEach( troopDef => {
      capacity = capacity.plus(troopDef.count)
    })
    return toInt(capacity)
  }

  getCountForType(type:TroopType) {
    return this.troopDefs.reduce((sum, td) => {
      if( td.type === type ) {
        return sum.plus(td.count)
      } else {
        return sum
      }
    }, toInt(0))
  }

  getPowerForType(type:TroopType) {
    const countForType = this.getCountForType(type)
    return countForType.times(TroopData.forTierAndType(this.tierNum, type).power)
  }

  collectAttributeForType(type:TroopType, attr:string) {
    const countForType = this.getCountForType(type)
    return countForType.times(TroopData.forTierAndType(this.tierNum, type)[attr])
  }

  updateCap(capacity:Big) {
    const max = toInt(99999999)
    const zero = toInt(0)
    if( capacity.gt(max) ) { capacity = max }
    if( capacity.lt(zero) ) { capacity = zero }
    this.capacity = capacity
    this.markForUpdate()
  }

  updatePercent(percent:Big) {
    if( this.capacityLocked ) return
    const max = toInt(100)
    const zero = toInt(0)
    if( percent.gt(max) ) { percent = max }
    if( percent.lt(zero) ) { percent = zero }
    this.percent = percent
    this.markForUpdate()
  }

  updateCapacityLock(state: boolean) {
    this.capacityLocked = state
    this.markForUpdate()
    if( state ) {
      this.troopDefs.forEach( troopDef => troopDef.updateCountLock(state) )
    }
  }

  resolveLockStates() {
    let allTroopDefsLocked = true
    this.troopDefs.forEach( troopDef => {
      allTroopDefsLocked = allTroopDefsLocked && troopDef.countLocked
    })
    this.updateCapacityLock(allTroopDefsLocked)
    this.markForUpdate()
  }

  getLockedTroopCount():Big {
    let lockedCount:Big = toInt(0)
    this.troopDefs.forEach( troopDef => {
      if( troopDef.countLocked ) {
        lockedCount = lockedCount.plus(troopDef.count)
      }
    })
    return lockedCount
  }

  getUnlockedCapacity():Big {
    return this.capacity.minus(this.getLockedTroopCount())
  }

  troopPercentSum():Big {
    let sum = toInt(0)
    this.troopDefs.forEach( troopDef => sum = sum.plus(troopDef.percent) )
    return sum
  }

  troopPercentDelta() {
    return this.troopPercentSum().minus(toInt(100))
  }

  hasTroopPercentDelta() {
    return this.troopPercentDelta().abs().gt(PercentDeltaEpsilon)
  }

  fixTroopPercent(troopDef:MTroopDef, delta:Big) {
    let newPercent = troopDef.percent.minus(delta)
    const hundred = toBig(100)
    const zero = toBig(0)
    if( newPercent.lt(zero) ) { newPercent = zero }
    if( newPercent.gt(hundred) ) { newPercent = hundred }
    troopDef.percent = newPercent
    this.markForUpdate()
  }

  calculateAndUpdateTroopPercents(fixDelta:boolean = true) {
    this.troopDefs.forEach( troopDef => {
      troopDef.calculateAndUpdatePercent(this.getUnlockedCapacity())
    })
    if( fixDelta && this.hasTroopPercentDelta() ) {
      let unlockedTroopDefs = this.troopDefs.filter( troopDef => {
        return !troopDef.countLocked
      })
      const firstUnlockedTierDef = unlockedTroopDefs[0]
      if( firstUnlockedTierDef ) {
        const initialDelta = this.troopPercentDelta()
        const partialDelta = initialDelta.div(unlockedTroopDefs.length)
        unlockedTroopDefs.forEach( troopDef => {
          this.fixTroopPercent(troopDef, partialDelta)
        })
        this.fixTroopPercent(firstUnlockedTierDef, this.troopPercentDelta())
      }
    }
    this.markForUpdate()
  }

  calculateAndUpdateTroopCounts() {
    this.troopDefs.forEach( troopDef => {
      troopDef.calculateAndUpdateCount(this.getUnlockedCapacity())
    })
  }

  calculateAndUpdatePercent(marchCap:Big) {
    if((marchCap.eq(0)) || this.capacityLocked) {
      this.percent = toBig(0)
    } else {
      this.percent = this.capacity.times(100).div(marchCap)
    }
    this.markForUpdate()
    return this.percent
  }

  calculateAndUpdateCap(marchCap:Big) {
    if( !this.capacityLocked ) {
      this.capacity = this.percent.times(marchCap).div(100).round()
    }
    this.markForUpdate()
    return this.capacity
  }

}

export { MTierDef }
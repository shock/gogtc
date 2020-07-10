import { Big } from 'big.js'
import { toInt, toBig } from '../../../lib/fixed-point'
import { TroopType } from '../../../lib/fc-types'
import MBase from '../../../lib/models/MBase'

type ITroopType = {
  type: TroopType
  count: Big
  percent: Big
  countLocked: boolean
}

export class MTroopDef extends MBase{
  type: TroopType
  count: Big
  percent: Big
  countLocked: boolean

  constructor(type:TroopType, count:Big, percent:Big = toBig(0), countLocked:boolean = false) {
    super()
    this.type = type
    this.count = toInt(count)
    this.percent = toBig(percent)
    this.countLocked = countLocked
  }

  clone():MTroopDef {
    const clone = new MTroopDef(this.type, this.count, this.percent, this.countLocked)
    clone.changed = this.changed
    clone.key = this.key
    return clone
  }

  objectForState() {
    return this
  }

  toJsonObject() {
    let obj:any = {}
    obj.type = this.type
    obj.count = this.count
    obj.percent = this.percent
    obj.countLocked = this.countLocked
    return obj
  }

  static fromJsonObject(obj:any) {
    ['type', 'count', 'percent', 'countLocked'].forEach( prop => {
      if( !obj.hasOwnProperty(prop) ) {
        throw new Error(`must have property: ${prop}`)
      }
    })
    return new MTroopDef(
      obj.type,
      obj.count,
      obj.percent,
      obj.countLocked
    )
  }

  // updates the count unless the percentage is locked
  updateCount(value: Big) {
    let count = value
    const max = toInt(99999999)
    const zero = toInt(0)
    if( count.gt(max) ) { count = max }
    if( count.lt(zero) ) { count = zero }
    this.count = count
    this.markForUpdate()
  }

  // updates the percentage unless the count is locked
  updatePercent(value: Big) {
    if(this.countLocked) return
    let percent = value
    const hundred = toInt(100)
    const zero = toInt(0)
    if( percent.gt(hundred) ) {
      percent = hundred
    }
    if( percent.lt(zero) ) {
      percent = zero
    }
    this.percent = percent
    this.markForUpdate()
  }

  updateCountLock(state: boolean) {
    this.countLocked = state
    this.markForUpdate()
  }

  // calculates the percentage of this troopDefs's count of the supplied tier capcity
  // if countLocked is true, the calculation is always zero
  // the troopDefs's percent attribute is updated withe calculated value and returned
  calculateAndUpdatePercent(tierCapacity:Big) {
    if(tierCapacity.eq(0) || this.countLocked) {
      this.percent = toBig(0)
    } else {
      this.percent = this.count.times(100).div(tierCapacity)
    }
    this.markForUpdate()
    return this.percent
  }

  // returns the actual percent of the supplied tierCapacity for this troopDef's count
  // no attribute are mutated
  getActualPercent(tierCapacity:Big):Big {
    if( tierCapacity.eq(0) ) { return toBig(0) }
    return this.count.times(100).div(tierCapacity)
  }

  calculateAndUpdateCount(capacity:Big) {
    if( !this.countLocked ) {
      this.count = this.percent.times(capacity).div(100).round()
    }
    this.markForUpdate()
    return this.count
  }

}
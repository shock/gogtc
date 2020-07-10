import { TierNum, TroopType } from '../../../lib/fc-types'
import troopData from './troop_data'
import { Big } from 'big.js'

class _TroopData {
  rawTroopData: any[]
  normalizedData: any[]
  dataByTier: {[key: string]: any}
  dataByTierAndType: {[key: string]: {[key: string]: any}}

  constructor() {
    this.rawTroopData = troopData
    this.normalizedData = this.convertNumbersToBigs(troopData)
    this.dataByTier = this.byTier()
    this.dataByTierAndType = this.byTierAndType()
  }

  convertNumberToBig = (number:number) => {
    return new Big(number)
  }

  convertNumbersToBigs(records: any[]) {
    return records.map(record => {
      const copy = {} as {[key:string]: any}
      Object.keys(record).forEach(key => {
        if( key.match(/health|attack|defense|speed|power|load|upkeep/) ) {
          copy[key] = this.convertNumberToBig(record[key])
        } else {
          copy[key] = record[key]
        }
      })
      return copy
    })
  }

  byTier():{[key: string]: any} {
    const reducer = (data:{[key: string]: any}, record:any) => {
      if( !data[record.tier] ) {
        data[record.tier] = []
      }
      data[record.tier].push(record)
      return data
    }
    const troopDataByTier = this.normalizedData.reduce(reducer, {} as {[key: string]: any})
    return troopDataByTier
  }

  byTierAndType() {
    const troopDataByTier = this.byTier()
    const troopDataByTierAndType: {[key:string]: {[key:string]: any}[]} = {}
    const reducer = (data:{[key: string]: any}, record:any) => {
      data[record.type] = record
      return data
    }
    Object.keys(troopDataByTier).forEach(tier => {
      troopDataByTierAndType[tier] = troopDataByTier[tier].reduce(reducer, {})
    })
    return troopDataByTierAndType
  }

  forTierAndType(tier:TierNum, type:TroopType) {
    return this.dataByTierAndType[tier][type]
  }

  data() { return this.dataByTierAndType }

}

const TroopData = new _TroopData();
export { TroopData }
export default TroopData
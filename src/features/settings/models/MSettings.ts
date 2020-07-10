import { Big } from 'big.js'
import { toInt } from '../../../lib/fixed-point'
import { TierNum, CalcView } from '../../../lib/fc-types'

class MSettings {
  marchCap:Big = toInt(0)
  highestTier:TierNum = TierNum.T12
  debug:boolean = false
  calcView:CalcView = 'calculator'
}

export default MSettings
export { MSettings }
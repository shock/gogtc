import { Big } from 'big.js'

export const toInt = (value:any) => {
  let num = parseFloat(value)
  if( isNaN(num) ) { num = 0 }
  return new Big(num).round()
}

export const toBig = (value:any) => {
  let num = parseFloat(value)
  if( isNaN(num) ) { num = 0 }
  return new Big(num)
}

import { TierNum, TroopType } from "../../../lib/fc-types"

/*
  id strings are used to to uniquely identify model instances in a form calculator model hierarchy

  An id string is comproised of one or more identifiers (aka parts) joined with a colon (':')
  Each identifier or part of the the string has semantic meaning depending on what
  data attribute it associated with.

  For example, an MTroopDef's identifier is comprised of 3 parts.  The first part
  always identifies the MFormCalc's id as a string. The second part identifies
  the MTierDef using a TierNum. The 3rd part identifies the MTroopDef using the
  TroopType.

  eg.

    const formCalcId:string
    const tierNum:TierNum
    const troopType:TroopType

    // identifies a unique MTroopDef model instance
    const troopDefId = `${formCalcId}:${tierNum}:${troopType}`

*/

export const getFormCalcId = (id:string) => ( id.split(':')[0] )
export const getTierNum = (id: string) => ( id.split(':')[1] as TierNum )
export const getTroopType = (id: string) => ( id.split(':')[2] as TroopType )

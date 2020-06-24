import { TierNum, TroopType } from "../types";

/*
  id strings are used to to uniquely identify model instances in a form calculator model hierarchy

  An id string is comproised of one or more identifiers (aka parts) joined with a colon (':')
  Each identifier or part of the the string has semantic meaning depending on what
  data attribute it associated with.

  For example, an MTroopDef's identifier is comprised of 3 parts.  The first part
  always identifies the MFormCalc's name as a string. The second part identifies
  the MTierDef using a TierNum. The 3rd part identifies the MTroopDef using the
  TroopType.

  eg.

    const formCalcName:string;
    const tierNum:TierNum;
    const troopType:TroopType;

    // identifies a unique MTroopDef model instance
    const troopDefId = `${formCalcName}:${tierNum}:${troopType}`;

*/

export const getFormCalcName = (id:string) => ( id.split(':')[0] );


export class IdParser {
  getFormCalcName(id: string) { return getFormCalcName(id) }
  getTierNum(id: string) { return id.split(':')[1] as TierNum; }
  getTroopType(id: string) { return id.split(':')[2] as TroopType; }
}
import { ActionType, getType } from 'typesafe-actions';
import { MTierDef} from '.';
import { IdParser } from './IdParser';
import { KeyedNumEntry, TierNum, TroopType, Int } from '../types';
import * as formCalcActions from '../actions';
import { updateNumEntry } from '../actions';
export type FormCalcAction = ActionType<typeof formCalcActions>;


class MFormCalc extends IdParser {
  name: string;
  tierDefs: MTierDef[] = [];

  constructor(name:string) {
    super();
    this.name = name;
  }

  addTierDefs(tierDefs: MTierDef[]) {
    this.tierDefs = tierDefs;
  }

  setTierDefs(tierDef: MTierDef) {
    this.tierDefs.push(tierDef);
  }

  id():string {
    return this.name;
  }

  findTierDef( tierNum: TierNum ) {

    const selected = this.tierDefs.find( tierDef => tierDef.tierNum === tierNum );
    if( selected === undefined )
      throw new Error(`could not find MTierDef with tierNum ==${tierNum}`)
    return selected;
  }

  handleAction( action:FormCalcAction ) {
    switch (action.type) {
      case getType(updateNumEntry):
        const idParts = action.payload.id.split(':');
        const tierNum = this.getTierNum(action.payload.id);
        const troopType = this.getTroopType(action.payload.id);
        const tierDef = this.findTierDef(tierNum);
        const troopDef = tierDef.findTroopDef(troopType);
        troopDef.setCount(action.payload.value);
    }
    const state = {
      numEntries: this.getNumEntries()
    }
    return state;
  }

  getNumEntries() {
    let numEntries:KeyedNumEntry = {};
    this.tierDefs.forEach((tierDef) => {
      numEntries = Object.assign({}, numEntries, tierDef.getNumEntries());
    });
    return numEntries;
  }
};

export { MFormCalc };
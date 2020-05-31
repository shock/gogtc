import { ActionType, getType } from 'typesafe-actions';
import { MTierDef, MTroopDef } from '.';
import { IdParser } from './IdParser';
import { TierNum, TroopType } from '../types';
import * as formCalcActions from '../actions';
import { updateNumEntry, updateTroopCount } from '../actions';
import { FCState, BlankFCState, KeyedNumEntry, TroopDefDictionary } from '.';
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

  getTroopDefs():TroopDefDictionary {
    const tdd = {
      troopDefs: {}
    } as TroopDefDictionary;
    let troopDefs:MTroopDef[] = [];
    this.tierDefs.forEach( (tierDef) => {
      troopDefs = troopDefs.concat(tierDef.troopDefs);
    });
    troopDefs.forEach( (troopDef) => {
      tdd.troopDefs[troopDef.id()] = troopDef;
    });
    return tdd;
  }

  handleAction( state:FCState, action:FormCalcAction ) {
    let tierNum:TierNum;
    let troopType:TroopType;
    let tierDef:MTierDef;
    let troopDef:MTroopDef;

    switch (action.type) {
      case getType(updateNumEntry):
        tierNum = this.getTierNum(action.payload.id);
        troopType = this.getTroopType(action.payload.id);
        tierDef = this.findTierDef(tierNum);
        troopDef = tierDef.findTroopDef(troopType);
        troopDef.setCount(action.payload.value);
        break;
      case getType(updateTroopCount):
        tierNum = this.getTierNum(action.payload.id);
        troopType = this.getTroopType(action.payload.id);
        tierDef = this.findTierDef(tierNum);
        troopDef = tierDef.findTroopDef(troopType);
        troopDef.setCount(action.payload.value);
        break;
    }
    const returnState = {
      ...state,
      numEntries: this.getNumEntries(),
      ...this.getTroopDefs()
    }
    return returnState;
  }

  getNumEntries() {
    let numEntries:KeyedNumEntry = {};
    this.tierDefs.forEach((tierDef) => {
      numEntries = Object.assign({}, numEntries, tierDef.getNumEntries());
    });
    return numEntries;
  }

  getState(state:FCState = BlankFCState) {
    const numEntries = this.getNumEntries();
    const returnState = {
      ...state,
      numEntries: this.getNumEntries(),
      ...this.getTroopDefs()
    }
    return returnState;
  }
};

export { MFormCalc };
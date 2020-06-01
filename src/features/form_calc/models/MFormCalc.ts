import { ActionType, getType } from 'typesafe-actions';
import { MTierDef, MTroopDef, TierDefDictionary } from '.';
import { IdParser } from './IdParser';
import { TierNum, TroopType, Int, toInt } from '../types';
import * as actions from '../actions';
import { FCState, BlankFCState, TroopDefDictionary, FormCalcDictionary } from '.';
export type FormCalcAction = ActionType<typeof actions>;


class MFormCalc extends IdParser {
  name: string;
  tierDefs: MTierDef[] = [];
  marchCap:Int = toInt(0);

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

  getTierDefs():TierDefDictionary {
    const tdd = {
      tierDefs: {}
    } as TierDefDictionary;
    this.tierDefs.forEach( (tierDef) => {
      tdd.tierDefs[tierDef.id()] = tierDef;
    });
    return tdd;
  }

  handleAction( state:FCState, action:FormCalcAction ) {
    let tierNum:TierNum;
    let troopType:TroopType;
    let tierDef:MTierDef;
    let troopDef:MTroopDef;

    switch (action.type) {
      case getType(actions.updateMarchCap) :
        this.updateMarchCap(toInt(action.payload.value));
        break;
      case getType(actions.updateTierCap) :
      case getType(actions.updateTierPercent) :
        tierNum = this.getTierNum(action.payload.id);
        tierDef = this.findTierDef(tierNum);
        switch (action.type) {
          case getType(actions.updateTierCap) :
            tierDef.updateCap(toInt(action.payload.value));
            tierDef.troopDefs.forEach( troopDef => {
              troopDef.calculateAndUpdateCount(tierDef.tierCap);
            });
            this.resetFromTroopCounts();
            break;
          case getType(actions.updateTierPercent) :
            tierDef.updatePercent(parseFloat(action.payload.value));
            this.resetFromPercentages();
            break;
        }
        break;
      case getType(actions.updateTroopCount) :
      case getType(actions.updateTroopPercent) :
        tierNum = this.getTierNum(action.payload.id);
        troopType = this.getTroopType(action.payload.id);
        tierDef = this.findTierDef(tierNum);
        troopDef = tierDef.findTroopDef(troopType);
        switch (action.type) {
          case getType(actions.updateTroopCount) :
            troopDef.updateCount(action.payload.value);
            this.resetFromTroopCounts();
            break;
          case getType(actions.updateTroopPercent) :
            troopDef.updatePercent(action.payload.value);
            this.resetFromPercentages();
            break;
        }
        break;
    }
    return this.getState();
  }

  getState(state:FCState = BlankFCState) {

    const formCalcDictionary:FormCalcDictionary = {
      formCalcs: {}
    };
    formCalcDictionary.formCalcs[this.name] = this;
    const returnState = {
      ...state,
      ...formCalcDictionary,
      ...this.getTierDefs(),
      ...this.getTroopDefs()
    }
    return returnState;
  }

  /*
    COMPUTATION FUNCTIONS
  */

  // gets the tier cap using the existing troop def counts
  // does not set this.tierCap
  getCapFromTierDefs() {
    let marchCap = 0;
    this.tierDefs.forEach( tierDef => {
      marchCap += tierDef.getCapFromTroopDefs();
    });
    return toInt(marchCap);
  }

  updateMarchCap(marchCap:Int) {
    this.marchCap = marchCap;
  }

  resetFromTroopCounts() {
    this.updateMarchCap(this.getCapFromTierDefs());
    this.tierDefs.forEach( tierDef => {
      tierDef.updateCap( toInt(tierDef.getCapFromTroopDefs()) );
      tierDef.calculateAndUpdatePercent(this.marchCap);
      tierDef.troopDefs.forEach( troopDef => {
        troopDef.calculateAndUpdatePercent(tierDef.tierCap);
      });
    });
  }

  resetFromPercentages() {
    this.tierDefs.forEach( tierDef => {
      tierDef.calculateAndUpdateCap(this.marchCap);
      tierDef.troopDefs.forEach( troopDef => {
        troopDef.calculateAndUpdateCount(tierDef.tierCap);
      });
    });
  }

};

export { MFormCalc };
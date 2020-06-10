import { ActionType, getType } from 'typesafe-actions';
import { MTierDef, MTroopDef, TierDefDictionary } from '.';
import { IdParser } from './IdParser';
import { TierNum, TroopType, Int, toInt, IdString, IdBoolean, IdOnly } from '../types';
import * as actions from '../actions';
import { FCState, BlankFCState, TroopDefDictionary, FormCalcDictionary } from '.';
export type FormCalcAction = ActionType<typeof actions>;


class MFormCalc extends IdParser {
  name: string;
  tierDefs: MTierDef[] = [];
  marchCap:Int = toInt(0);
  debug:boolean = false;

  constructor(name:string) {
    super();
    this.name = name;
  }

  id():string {
    return this.name;
  }

  findTierDef( id: string ) {
    const tierNum = this.getTierNum(id);
    const selected = this.tierDefs.find( tierDef => tierDef.tierNum === tierNum );
    if( selected === undefined )
      throw new Error(`could not find MTierDef with tierNum ==${tierNum}`)
    return selected;
  }

  findTroopDef( id: string) {
    const tierDef = this.findTierDef(id);
    const troopType = this.getTroopType(id);
    return tierDef.findTroopDef(troopType);
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

  //
  // ACTION HANDLERS
  //

  // Handles change to main march cap.
  // should update entire formation based on new march cap
  handleUpdateMarchCap(payload:IdString) {
    this.updateMarchCap(toInt(payload.value));
    this.updateCountsFromPercents();
    // this.recalculateCountsThenPercents();
  }

  // We're not supporting this for now.
  handleUpdateTierCap(payload:IdString) {
    const tierDef = this.findTierDef(payload.id);
    tierDef.updateCap(toInt(payload.value));
    tierDef.troopDefs.forEach( troopDef => {
      troopDef.calculateAndUpdateCount(tierDef.capacity);
    });
    this.updatePercentsFromCounts();
    // this.recalculatePercentsThenCounts();
  }

  // Updates the tier percent and corespondingly the troop defs' counts
  // and the tier cap
  handleUpdateTierPercent(payload:IdString) {
    const tierDef = this.findTierDef(payload.id);
    tierDef.updatePercent(parseFloat(payload.value));
    this.updateCountsFromPercents();
    // this.recalculateCountsThenPercents();
  }

  // Updates an individual troop def's count
  // if the troop def's count is not locked, updates the unlocked troop def percentages
  // without changing the sibling troop def counts
  handleUpdateTroopCount(payload:IdString) {
    const troopDef = this.findTroopDef(payload.id);
    troopDef.updateCount(payload.value);
    this.updatePercentsFromCounts();
    // this.recalculatePercentsThenCounts();
  }

  // updates the troop def percentage if it's not count-locked
  // updates the troop count accordingly which, in turn, updates the tier defs' cap
  handleUpdateTroopPercent(payload:IdString) {
    const troopDef = this.findTroopDef(payload.id);
    troopDef.updatePercent(payload.value);
    this.updateCountsFromPercents();
    // this.updatePercentsFromCounts();
    // tierDef.updateTroopDefPercent(troopDef, +action.payload.value);
    // this.recalculateCountsThenPercents();
  }

  handleUpdateTroopCountLock(payload:IdBoolean) {
    const troopDef = this.findTroopDef(payload.id);
    troopDef.updateCountLock(payload.boolean);
    this.resolveLockStates();
    this.updatePercentsFromCounts();
    // this.recalculatePercentsThenCounts();
  }

  handleFixTroopPercent(payload:IdOnly) {
    const tierDef = this.findTierDef(payload.id);
    const troopDef = this.findTroopDef(payload.id);
    tierDef.fixTroopPercent(troopDef);
    this.updateCountsFromPercents();
  }

  handleToggleFormCalcDebug(payload:IdOnly) {
    this.debug = !this.debug;
  }

  handleAction( state:FCState, action:FormCalcAction ) {
    switch (action.type) {
      case getType(actions.updateMarchCap) :
        this.handleUpdateMarchCap(action.payload);
        break;
      case getType(actions.updateTierCap) :
        this.handleUpdateTierCap(action.payload);
        break;
      case getType(actions.updateTierPercent) :
        this.handleUpdateTierPercent(action.payload);
        break;
      case getType(actions.updateTroopCount) :
        this.handleUpdateTroopCount(action.payload);
        break;
      case getType(actions.updateTroopPercent) :
        this.handleUpdateTroopPercent(action.payload);
        break;
      case getType(actions.updateTroopCountLock) :
        this.handleUpdateTroopCountLock(action.payload);
        break;
      case getType(actions.fixTroopPercent) :
        this.handleFixTroopPercent(action.payload);
        break;
      case getType(actions.toggleFormCalcDebug) :
        this.handleToggleFormCalcDebug(action.payload);
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
  // does not change anything
  getCapFromTierDefs() {
    let marchCap = 0;
    this.tierDefs.forEach( tierDef => {
      marchCap += tierDef.getCapFromTroopDefs();
    });
    return toInt(marchCap);
  }

  // gets the sum of tier def percents
  // does not change anything
  getTierDefPercentsSum() {
    let sum = 0;
    this.tierDefs.forEach( tierDef => {
      sum += tierDef.percent;
    });
    return sum;
  }

  updateMarchCap(marchCap:Int) {
    this.marchCap = marchCap;
  }

  resolveLockStates() {
    this.tierDefs.forEach( tierDef => {tierDef.resolveLockStates()} );
  }

  updatePercentsFromCounts() {
    this.updateMarchCap(this.getCapFromTierDefs());
    this.tierDefs.forEach( tierDef => {
      tierDef.updateCap( toInt(tierDef.getCapFromTroopDefs()) );
      tierDef.calculateAndUpdatePercent(this.marchCap);
      tierDef.calculateAndUpdateTroopPercents(true);
    });
  }

  updateCountsFromPercents() {
    this.tierDefs.forEach( tierDef => {
      tierDef.calculateAndUpdateCap(this.marchCap);
      tierDef.calculateAndUpdateTroopCounts();
    });
  }

  recalculateCountsThenPercents() {
    this.updateCountsFromPercents();
    this.updatePercentsFromCounts();
  }

  recalculatePercentsThenCounts() {
    this.updatePercentsFromCounts();
    this.updateCountsFromPercents();
  }

};

export { MFormCalc };
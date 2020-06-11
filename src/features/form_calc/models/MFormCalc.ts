import { ActionType, getType } from 'typesafe-actions';
import { Big } from 'big.js';

import { MTierDef, MTroopDef } from '.';
import { IdParser } from './IdParser';
import { toInt, toBig, IdString, IdBoolean, IdOnly } from '../types';
import * as actions from '../actions';
import { FCState, BlankFCState, FormCalcDictionary } from '.';
export type FormCalcAction = ActionType<typeof actions>;

const PercentPrecision = 4;
// const PercentDeltaEpsilon = toBig(parseFloat((0.1**(PercentPrecision+1)).toFixed(PercentPrecision+1)));
const PercentDeltaEpsilon = 0;

class MFormCalc extends IdParser {
  name: string;
  tierDefs: MTierDef[] = [];
  marchCap:Big = toInt(0);
  debug:boolean = true;

  constructor(name:string) {
    super();
    this.name = name;
  }

  asJsonObject() {
    let obj:any = {};
    obj.name = this.name;
    obj.marchCap = this.marchCap;
    obj.debug = this.debug;
    obj.tierDefs = this.tierDefs.map( tierDef => {
      return tierDef.asJsonObject();
    });
    return obj;
  }

  id():string {
    return this.name;
  }

  findTierDef(id: string) {
    const tierNum = this.getTierNum(id);
    const selected = this.tierDefs.find( tierDef => tierDef.tierNum === tierNum );
    if( selected === undefined )
      throw new Error(`could not find MTierDef with tierNum ==${tierNum}`)
    return selected;
  }

  findTroopDef(id: string) {
    const tierDef = this.findTierDef(id);
    const troopType = this.getTroopType(id);
    return tierDef.findTroopDef(troopType);
  }

  getTroopDefs():MTroopDef[] {
    let troopDefs:MTroopDef[] = [];
    this.tierDefs.forEach( (tierDef) => {
      troopDefs = troopDefs.concat(tierDef.troopDefs);
    });
    return troopDefs;
  }

  getTierDefs():MTierDef[] {
    return this.tierDefs;
  }

  tierPercentSum():Big {
    let sum = toBig(0);
    this.tierDefs.forEach( tierDef => sum = sum.plus(tierDef.percent) );
    return sum;
  }

  tierPercentDelta() {
    return this.tierPercentSum().minus(100);
  }

  hasTierPercentDelta() {
    return this.tierPercentDelta().abs().gt(PercentDeltaEpsilon);
  }

  fixTierPercent(tierDef:MTierDef) {
    let newPercent = tierDef.percent.minus(this.tierPercentDelta());
    const zero = toInt(0);
    const hundred = toInt(100);
    if( newPercent.lt(zero) ) { newPercent = zero; }
    if( newPercent.gt(hundred) ) { newPercent = hundred; }
    tierDef.percent = newPercent;
  }

  //
  // ACTION HANDLERS
  //

  // Handles change to main march cap.
  // should update entire formation based on new march cap
  handleUpdateMarchCap(payload:IdString) {
    this.updateMarchCap(toInt(payload.value));
    this.updateCountsFromPercents();
  }

  // We're not supporting this for now.
  handleUpdateTierCap(payload:IdString) {
    const tierDef = this.findTierDef(payload.id);
    tierDef.updateCap(toInt(payload.value));
    tierDef.troopDefs.forEach( troopDef => {
      troopDef.calculateAndUpdateCount(tierDef.capacity);
    });
    this.updateMarchCap(this.getCapFromTierDefs());
    this.updatePercentsFromCounts();
  }

  // Updates the tier percent and corespondingly the troop defs' counts
  // and the tier cap
  handleUpdateTierPercent(payload:IdString) {
    const tierDef = this.findTierDef(payload.id);
    tierDef.updatePercent(toBig(payload.value));
    this.updateCountsFromPercents();
  }

  // Updates an individual troop def's count
  // if the troop def's count is not locked, updates the unlocked troop def percentages
  // without changing the sibling troop def counts
  handleUpdateTroopCount(payload:IdString) {
    const troopDef = this.findTroopDef(payload.id);
    troopDef.updateCount(toBig(payload.value));
    this.updateMarchCap(this.getCapFromTierDefs());
    this.updatePercentsFromCounts();
  }

  // updates the troop def percentage if it's not count-locked
  // updates the troop count accordingly which, in turn, updates the tier defs' cap
  handleUpdateTroopPercent(payload:IdString) {
    const troopDef = this.findTroopDef(payload.id);
    troopDef.updatePercent(toBig(payload.value));
    this.updateCountsFromPercents();
  }

  handleUpdateTroopCountLock(payload:IdBoolean) {
    const troopDef = this.findTroopDef(payload.id);
    troopDef.updateCountLock(payload.boolean);
    this.resolveLockStates();
    this.updatePercentsFromCounts();
  }

  handleUpdateTierCapcityLock(payload:IdBoolean) {
    const tierDef = this.findTierDef(payload.id);
    tierDef.updateCapacityLock(payload.boolean);
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

  handleFixTierPercent(payload:IdOnly) {
    const tierDef = this.findTierDef(payload.id);
    this.fixTierPercent(tierDef);
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
      case getType(actions.updateTierCapacityLock) :
        this.handleUpdateTierCapcityLock(action.payload);
        break;
      case getType(actions.fixTroopPercent) :
        this.handleFixTroopPercent(action.payload);
        break;
      case getType(actions.fixTierPercent) :
        this.handleFixTierPercent(action.payload);
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
    }
    return returnState;
  }

  /*
    COMPUTATION FUNCTIONS
  */

  // gets the tier cap using the existing troop def counts
  // does not change anything
  getCapFromTierDefs() {
    let marchCap = toInt(0);
    this.tierDefs.forEach( tierDef => {
      marchCap = marchCap.plus(tierDef.getCapFromTroopDefs());
    });
    return toInt(marchCap);
  }

  getLockedTierCap():Big {
    let lockedCap:Big = toInt(0);
    this.tierDefs.forEach( tierDef => {
      if( tierDef.capacityLocked ) {
        lockedCap = lockedCap.plus(tierDef.capacity);
      }
    });
    return lockedCap;
  }

  getUnlockedCapacity():Big {
    return toInt(this.marchCap.minus(this.getLockedTierCap()));
  }

  // gets the sum of tier def percents
  // does not change anything
  getTierDefPercentsSum() {
    let sum = toInt(0);
    this.tierDefs.forEach( tierDef => {
      sum = sum.plus(tierDef.percent);
    });
    return sum;
  }

  updateMarchCap(marchCap:Big) {
    this.marchCap = marchCap;
  }

  resolveLockStates() {
    this.tierDefs.forEach( tierDef => {tierDef.resolveLockStates()} );
  }

  calculateAndUpdateTierPercents(fixDelta:boolean = true) {
    this.tierDefs.forEach( tierDef => {
      tierDef.calculateAndUpdatePercent(this.marchCap);
    });
    if( fixDelta && this.hasTierPercentDelta() ) {
      let firstUnlockedTierDef:MTierDef|null = null;
      for( let i=0; i<this.tierDefs.length; i++ ) {
        if( !this.tierDefs[i].capacityLocked ) {
          firstUnlockedTierDef = this.tierDefs[i];
          break;
        }
      }
      if( firstUnlockedTierDef ) {
        this.fixTierPercent(firstUnlockedTierDef);
      }
    }
  }

  updatePercentsFromCounts(fixPercent:boolean=true) {
    this.tierDefs.forEach( tierDef => {
      tierDef.updateCap( toInt(tierDef.getCapFromTroopDefs()) );
      tierDef.calculateAndUpdatePercent(this.marchCap);
      tierDef.calculateAndUpdateTroopPercents(true);
    });
    this.calculateAndUpdateTierPercents(fixPercent);
  }

  updateTierPercentsFromCounts(fixPercent:boolean=true) {
    this.tierDefs.forEach( tierDef => {
      tierDef.updateCap( toInt(tierDef.getCapFromTroopDefs()) );
      tierDef.calculateAndUpdatePercent(this.marchCap);
    });
    this.calculateAndUpdateTierPercents(fixPercent);
  }

  updateCountsFromPercents() {
    this.tierDefs.forEach( tierDef => {
      tierDef.calculateAndUpdateCap(this.marchCap);
      tierDef.calculateAndUpdateTroopCounts();
    });
  }

};

export { MFormCalc };
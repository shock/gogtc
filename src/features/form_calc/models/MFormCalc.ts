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

  //
  // ACTION HANDLERS
  //

  // Handles change to main march cap.
  // should update entire formation based on new march cap
  updateMarchCapHandler(payload:IdString) {
    this.updateMarchCap(toInt(payload.value));
    this.updateCountsFromPercents();
    return this.getState();
  }

  // Updates the tier percent and corespondingly the troop defs' counts
  // and the tier cap
  updateTierPercentHandler(payload:IdString) {
    const tierDef = this.findTierDef(payload.id);
    tierDef.updatePercent(toBig(payload.value));
    this.updateCountsFromPercents();
    return this.getState();
  }

  // Updates an individual troop def's count
  // if the troop def's count is not locked, updates the unlocked troop def percentages
  // without changing the sibling troop def counts
  updateTroopCountHandler(payload:IdString) {
    const troopDef = this.findTroopDef(payload.id);
    troopDef.updateCount(toBig(payload.value));
    this.updateMarchCap(this.getCapFromTierDefs());
    this.updatePercentsFromCounts();
    return this.getState();
  }

  // updates the troop def percentage if it's not count-locked
  // updates the troop count accordingly which, in turn, updates the tier defs' cap
  updateTroopPercentHandler(payload:IdString) {
    const troopDef = this.findTroopDef(payload.id);
    troopDef.updatePercent(toBig(payload.value));
    this.updateCountsFromPercents();
    return this.getState();
  }

  updateTroopCountLockHandler(payload:IdBoolean) {
    const troopDef = this.findTroopDef(payload.id);
    troopDef.updateCountLock(payload.boolean);
    this.resolveLockStates();
    this.updatePercentsFromCounts();
    return this.getState();
  }

  updateTierCapacityLockHandler(payload:IdBoolean) {
    const tierDef = this.findTierDef(payload.id);
    tierDef.updateCapacityLock(payload.boolean);
    this.resolveLockStates();
    this.updatePercentsFromCounts();
    // this.recalculatePercentsThenCounts();
    return this.getState();
  }

  fixTroopPercentHandler(payload:IdOnly) {
    const tierDef = this.findTierDef(payload.id);
    const troopDef = this.findTroopDef(payload.id);
    tierDef.fixTroopPercent(troopDef, tierDef.troopPercentDelta());
    this.updateCountsFromPercents();
    return this.getState();
  }

  fixTierPercentHandler(payload:IdOnly) {
    const tierDef = this.findTierDef(payload.id);
    this.fixTierPercent(tierDef, this.tierPercentDelta());
    this.updateCountsFromPercents();
    return this.getState();
  }

  toggleFormCalcDebugHandler(payload:IdOnly) {
    this.debug = !this.debug;
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

  fixTierPercent(tierDef:MTierDef, delta:Big) {
    let newPercent = tierDef.percent.minus(delta);
    const zero = toInt(0);
    const hundred = toInt(100);
    if( newPercent.lt(zero) ) { newPercent = zero; }
    if( newPercent.gt(hundred) ) { newPercent = hundred; }
    tierDef.percent = newPercent;
  }

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
      let unlockedTierDefs = this.tierDefs.filter( tierDef => {
        return !tierDef.capacityLocked;
      });
      const firstUnlockedTierDef = unlockedTierDefs[0];
      if( firstUnlockedTierDef ) {
        const initialDelta = this.tierPercentDelta();
        const partialDelta = initialDelta.div(unlockedTierDefs.length);
        unlockedTierDefs.forEach( tierDef => {
          this.fixTierPercent(tierDef, partialDelta);
        })
        this.fixTierPercent(firstUnlockedTierDef, this.tierPercentDelta());
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
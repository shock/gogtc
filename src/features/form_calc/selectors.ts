import { FormCalcState } from './reducer';
export const getNumEntries = (state: FormCalcState) => (state.formCalc.numEntries);
export const getTroopDefs = (state: FormCalcState) => (state.formCalc.troopDefs);

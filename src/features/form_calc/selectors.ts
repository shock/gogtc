import { FormCalcState } from './reducer';
export const getTroopDefs = (state: FormCalcState) => (state.formCalc.troopDefs);
export const getTierDefs = (state: FormCalcState) => (state.formCalc.tierDefs);
export const getFormCalcs = (state: FormCalcState) => (state.formCalc.formCalcs);

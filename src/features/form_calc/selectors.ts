import { FormCalcState } from './reducer';
export const getFormCalcs = (state: FormCalcState) => (state.present.formCalcs);

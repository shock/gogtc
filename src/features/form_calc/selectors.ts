import { FormCalcState } from './reducer'
export const getFormCalcs = (state: FormCalcState) => (state.formCalcs.present.formCalcs)
export const getCurrentId = (state: FormCalcState) => (state.formCalcs.present.currentId)

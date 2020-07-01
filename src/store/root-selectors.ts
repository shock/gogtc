import { RootState } from 'typesafe-actions'

export const getAsyncBusy = (state:RootState) => {
  return (
    state.formCalc.isCreatingCalc ||
    state.formCalc.isLoadingUserCalcs ||
    state.formCalc.isUpdatingCalc ||
    state.formCalc.isDeletingCalc ||
    state.users.isLoggingIn ||
    state.users.isRegistering
  )
}
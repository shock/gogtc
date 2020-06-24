import { StateType, ActionType } from 'typesafe-actions';
import { LocationState } from 'connected-react-router'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Path } from 'history'

///////////////////////////////////////////////////////////////////////
// Workaround for Typescript issue with connected-react-router
// https://github.com/supasate/connected-react-router/issues/286
//

type Push = (path: Path, state?: LocationState) => CallHistoryMethodAction<[Path, LocationState?]>;
// type Go, etc.

interface RouterActions {
  push: Push;
  // go: Go; etc.
}

//
//////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// Workaround for Typescript issue with connected-react-router
// https://github.com/supasate/connected-react-router/issues/286
//

type Push = (path: Path, state?: LocationState) => CallHistoryMethodAction<[Path, LocationState?]>;
// type Go, etc.

interface RouterActions {
  push: Push;
  // go: Go; etc.
}

//
//////////////////////////////////////////////////////////////////////

declare module 'typesafe-actions' {
  export type Store = StateType<typeof import('./index').default>;

  export type RootState = StateType<typeof import('./root-reducer').default>;

  // Add the connected-react-router action creater type for push to appease @typesafe-actions
  export type RootAction = ActionType<typeof import('./root-action').default>|ActionType<RouterActions>;

  interface Types {
    RootAction: RootAction;
  }
}

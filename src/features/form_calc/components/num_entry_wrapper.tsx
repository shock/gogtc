import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';

import * as selectors from '../selectors';
import * as actions from '../actions';

import { NumEntryView } from './num_entry_view';

const mapStateToProps = (state: RootState) => {
  return {
    isLoading: state.todos.isLoadingTodos,
    numEntries: selectors.getNumEntries(state.formCalc),
  }
};
const dispatchProps = {
  removeTodo: actions.incNumEntry,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

function TodoList({ isLoading, todos = [], removeTodo }: Props) {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
      <NumEntryView />
  );
}

export default connect(
  mapStateToProps,
  dispatchProps
)(TodoList);

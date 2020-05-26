import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';

import * as selectors from '../selectors';
import { initialState } from '../reducer';
import { NumEntryView } from './num_entry_view';

const mapStateToProps = (state: RootState) => ({
  formCalc: selectors.getNumEntries(state.formCalc)
});

const dispatchProps = {
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

class NumEntryWrapperBase extends React.Component<Props> {

  buildNumEntries() {
    const ids = Object.keys(initialState.numEntries);
    return ids.map( (id:string) => {
      const ne = initialState.numEntries[id];
      return <NumEntryView
        key={ne.id}
        id={id}
        value={this.props.formCalc[id].value}
        label={ne.label}
      />
    });
  }

  render() {
    return this.buildNumEntries();
  }
}

const NumEntryWrapper =  connect(
  mapStateToProps,
  dispatchProps
)(NumEntryWrapperBase);

export { NumEntryWrapper };
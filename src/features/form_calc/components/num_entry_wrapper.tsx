import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';

import * as selectors from '../selectors';
import * as actions from '../actions';

import { NumEntryView } from './num_entry_view';
import { FormCalcState } from '../reducer';

const mapStateToProps = (state: RootState) => ({
  formCalc: selectors.getNumEntries(state.formCalc)
});

const dispatchProps = {
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

class NumEntryWrapperBase extends React.Component<Props> {

  render() {
    return (
      <NumEntryView key={'1'} id={'1'} value={this.props.formCalc['1'].value} label={'label'} />
    );

  }
}

const NumEntryWrapper =  connect(
  mapStateToProps,
  dispatchProps
)(NumEntryWrapperBase);

export { NumEntryWrapper };
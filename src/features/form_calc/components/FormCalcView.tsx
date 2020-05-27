import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import * as selectors from '../selectors';
import { NumEntryView } from './NumEntryView';
import { FormCalc } from '../types';

const mapStateToProps = (state: RootState) => ({
  formCalc: selectors.getNumEntries(state.formCalc)
});

const dispatchProps = {
  resetState: actions.resetState
};

const initialState:FormCalc = {
  numEntries: {
    'march_cap' : {
      id: 'march_cap',
      value: '393870',
      label: 'March Cap'
    },
    'Infantry' : {
      id: 'Infantry',
      value: '1',
      label: 'Infantry'
    },
    'Cavalry' : {
      id: 'Cavalry',
      value: '1',
      label: 'Cavalry'
    },
    'Distance' : {
      id: 'Distance',
      value: '1',
      label: 'Distance'
    }
  }
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

class FormCalcViewBase extends React.Component<Props> {

  componentDidMount() {
    this.props.resetState(initialState);
  }

  buildNumEntries() {
    const ids = Object.keys(this.props.formCalc);
    return ids.map( (id:string) => {
      const ne = this.props.formCalc[id];
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

const FormCalcView =  connect(
  mapStateToProps,
  dispatchProps
)(FormCalcViewBase);

export { FormCalcView };
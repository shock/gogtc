import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import * as selectors from '../selectors';
import { TierDefView } from './TierDefView';
import { MFormCalc } from '../models/MFormCalc';
import { Library } from '../models';

const mapStateToProps = (state: RootState) => ({
  formCalc: selectors.getNumEntries(state.formCalc)
});

const dispatchProps = {
  resetState: actions.resetState
};

interface FormCalcViewProps {
  name: string;
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & FormCalcViewProps;

class FormCalcViewBase extends React.Component<Props> {
  formCalcModel:MFormCalc;

  constructor(props: Props) {
    super(props);
    this.formCalcModel = Library.formCalcModels.test;
  }

  componentDidMount() {
    const initialState = {
      numEntries: this.formCalcModel.getNumEntries()
    }
    this.props.resetState(initialState);
  }

  hasModel() {
    return this.formCalcModel;
  }

  // buildNumEntries() {
  //   const ids = Object.keys(this.props.formCalc);
  //   return ids.map( (id:string) => {
  //     const ne = this.props.formCalc[id];
  //     return <NumEntryView
  //       key={ne.id}
  //       id={id}
  //       value={this.props.formCalc[id].value}
  //       label={ne.label}
  //     />
  //   });
  // }

  buildTierDefViews() {
    if (this.formCalcModel) {
      return this.formCalcModel.tierDefs.map( (tierDef) => (
        <TierDefView tierDef={tierDef} />
      ));
    }
    return [];
  }

  render() {
    return this.buildTierDefViews();
  }
}

const FormCalcView =  connect(
  mapStateToProps,
  dispatchProps
)(FormCalcViewBase);

export { FormCalcView };
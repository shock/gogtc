import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import * as actions from '../actions';
import * as selectors from '../selectors';
import { TierDefView } from './TierDefView';
import { MFormCalc } from '../models/MFormCalc';
import { Library } from '../models';

const mapStateToProps = (state: RootState) => ({
  fcStore: selectors.getNumEntries(state.formCalc)
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

  buildTierDefViews() {
    if (this.formCalcModel) {
      return this.formCalcModel.tierDefs.map( (tierDef, index) => {
        return <TierDefView tierDef={tierDef} index={index}/>
      });
    }
    return [];
  }

  render() {
    return (
      <Row>
        <Col>
          {this.buildTierDefViews()}
        </Col>
      </Row>

    );
  }
}

const FormCalcView =  connect(
  mapStateToProps,
  dispatchProps
)(FormCalcViewBase);

export { FormCalcView };
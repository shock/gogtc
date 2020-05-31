import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import * as actions from '../actions';
import * as selectors from '../selectors';
import { TierDefView } from './TierDefView';
import { NumEntryView } from './NumEntryView';
import { MFormCalc } from '../models/MFormCalc';

const mapStateToProps = (state: RootState) => ({
  formCalcs: selectors.getFormCalcs(state.formCalc)
});

const dispatchProps = {
  resetState: actions.resetState,
  updateMarchCap: actions.updateMarchCap
};

interface FormCalcViewProps {
  formCalcModel: MFormCalc;
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & FormCalcViewProps;

class FormCalcViewBase extends React.Component<Props> {

  // constructor(props: Props) {
  //   super(props);
  // }

  componentDidMount() {
    this.resetReduxState();
  }

  componentDidUpdate(prevProps:Props) {
    if( prevProps.formCalcModel !== this.props.formCalcModel && this.hasModel()) {
      this.resetReduxState();
    }
  }

  resetReduxState() {
    this.props.resetState(this.props.formCalcModel.getState());
  }

  hasModel() {
    return this.props.formCalcModel;
  }

  buildTierDefViews() {
    if (this.props.formCalcModel) {
      return this.props.formCalcModel.tierDefs.map( (tierDef, index) => {
        return <TierDefView tierDef={tierDef} index={index}/>
      });
    }
    return (
      <span>No formation loaded.</span>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col>
            <h3>{this.props.formCalcModel?.name}</h3>
          </Col>
          <Col>
          <NumEntryView
            id={`${this.props.formCalcModel.name}:marchCap`}
            value={''+this.props.formCalcModel.marchCap}
            label={'March Cap'}
            updateAction={this.props.updateMarchCap}
          />

          </Col>
        </Row>
        <Row>
          <Col>
            {this.buildTierDefViews()}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const FormCalcView =  connect(
  mapStateToProps,
  dispatchProps
)(FormCalcViewBase);

export { FormCalcView };
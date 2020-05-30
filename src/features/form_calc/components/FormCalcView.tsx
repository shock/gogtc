import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import * as actions from '../actions';
import * as selectors from '../selectors';
import { TierDefView } from './TierDefView';
import { MFormCalc } from '../models/MFormCalc';

const mapStateToProps = (state: RootState) => ({
  fcStore: selectors.getNumEntries(state.formCalc)
});

const dispatchProps = {
  resetState: actions.resetState
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
    const state = {
      numEntries: this.props.formCalcModel.getNumEntries()
    }
    this.props.resetState(state);
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
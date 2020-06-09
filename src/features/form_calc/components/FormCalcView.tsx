import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';
import * as NumEntry from '../../../lib/num-entry';

import * as actions from '../actions';
import * as selectors from '../selectors';
import { TierDefView } from './TierDefView';
import { MFormCalc } from '../models/MFormCalc';

const mapStateToProps = (state: RootState) => ({
  // this has to be here to trigger re-rendering even though the props
  // used to render are passed from the parent.
  // TODO: figure out the right way to trigger re-rendering
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

  constructor(props: Props) {
    super(props);
    this.handleMarchCapChange = this.handleMarchCapChange.bind(this);
  }

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
        return <TierDefView key={index} tierDef={tierDef} index={index}/>
      });
    }
    return (
      <span>No formation loaded.</span>
    );
  }

  handleMarchCapChange(numVal:number|null, strVal:string, target:HTMLInputElement) {
    this.props.updateMarchCap(this.props.formCalcModel.id(), ''+numVal);
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col sm={3}>
            <h3>{this.props.formCalcModel?.name}</h3>
          </Col>
          <Col >
            <label>March Cap</label>&nbsp;
            <NumericInput
              step={100}
              min={0}
              max={999999}
              value={this.props.formCalcModel.marchCap}
              format={NumEntry.formatInteger}
              parse={NumEntry.parseInteger}
              onChange={this.handleMarchCapChange}
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
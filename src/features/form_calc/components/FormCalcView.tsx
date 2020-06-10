import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
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
  updateMarchCap: actions.updateMarchCap,
  toggleFormCalcDebug: actions.toggleFormCalcDebug
};

interface FormCalcViewProps {
  formCalcModel: MFormCalc;
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & FormCalcViewProps;

class FormCalcViewBase extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
    this.handleMarchCapChange = this.handleMarchCapChange.bind(this);
    this.handleDebugClick = this.handleDebugClick.bind(this);
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

  data() {
    return this.hasModel();
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
    this.props.updateMarchCap(this.data().id(), ''+numVal);
  }

  handleDebugClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.props.toggleFormCalcDebug(this.data().id());
  }

  renderDebug() {
    const button = (
      <Button
        variant={this.data().debug ? "primary" : "secondary"}
        onClick={this.handleDebugClick}
      >DEBUG</Button>
    );
    if( this.data().debug ) {
      return (
        <Col>
          <div className="NumCell inline nobr">
            <label>Troops Sum</label>
            <span className="sum">{this.data().getCapFromTierDefs()}</span>
          </div>
          <div className="NumCell inline nobr">
            <label>Tier % Sum</label>
            <span className="sum">{this.data().getTierDefPercentsSum().toFixed(3)}</span>
          </div>
          {button}
        </Col>
      );
    } else return (
      <Col>
        {button}
      </Col>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col sm={3}>
            <h3>{this.props.formCalcModel?.name}</h3>
          </Col>
          {this.renderDebug()}
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
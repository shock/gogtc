import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';
import * as NumEntry from '../../../lib/num-entry';

import * as actions from '../actions';
import * as selectors from '../selectors';
import { TierDefView } from './TierDefView';
import config from '../../../config';
import UndoRedo from './UndoRedo';

const mapStateToProps = (state: RootState) => ({
  formCalcs: selectors.getFormCalcs(state.formCalc)
});

const dispatchProps = {
  resetState: actions.resetState,
  updateMarchCap: actions.updateMarchCap,
};

interface FormCalcViewProps {
  id: string;
  debug: boolean;
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & FormCalcViewProps;

class FormCalcViewBase extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleMarchCapChange = this.handleMarchCapChange.bind(this);
  }

  static defaultProps = {
    debug: false
  }

  id():string {
    return this.props.id;
  }

  data() {
    const formCalc = this.props.formCalcs[this.props.id];
    return formCalc;
  }

  hasModel() {
    return this.data() !== undefined;
  }

  buildTierDefViews() {
    return this.data().tierDefs.map( (tierDef, index) => {
      return (
        <TierDefView
          id={`${this.id()}:${tierDef.tierNum}`}
          hasTierPercentDelta={this.data().hasTierPercentDelta()}
          key={index}
          tierDef={tierDef}
          index={index}
          debug={this.props.debug}
        />
      );
    });
  }

  handleMarchCapChange(numVal:number|null, strVal:string, target:HTMLInputElement) {
    this.props.updateMarchCap(this.data().id(), ''+numVal);
  }

  renderDebug() {
    if( !this.data() ) return (null);
    const formCalc = this.data();
    if( this.props.debug ) {
      return (
        <Col>
          <div className="NumCell inline nobr">
            <label>Troops Sum</label>
            <span className="sum">{formCalc.getCapFromTierDefs().toString()}</span>
          </div>
          <div className="NumCell inline nobr">
            <label>Tier % Sum</label>
            <span className="sum">{formCalc.getTierDefPercentsSum().toFixed(config.calcPrecision)}</span>
          </div>
        </Col>
      );
    } else return null;
  }

  render() {
    if( !this.data() ) return (null);
    const formCalc = this.data();
    return (
      <React.Fragment>
        <Row>
          <Col sm={3}>
            <h3>{formCalc.name}</h3>
          </Col>
          {this.renderDebug()}
          <Col >
            <label>March Cap</label>&nbsp;
            <NumericInput
              step={1000}
              snap
              min={0}
              max={999999}
              value={formCalc.marchCap.toString()}
              format={NumEntry.formatInteger}
              parse={NumEntry.parseInteger}
              onChange={this.handleMarchCapChange}
            />
          </Col>
          <Col sm={2}>
            <UndoRedo/>
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
import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as NumEntry from '../../../lib/num-entry';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { TroopDefView } from './TroopDefView';
import { LockState } from '../../../components/LockState';
import { MTierDef, PercentPrecision } from '../models';

const mapStateToProps = (state: RootState) => ({
  // hack to trigger re-rendering any time the formCalc changes
  // TODO: figure out an efficient way to trigger selective, partial re-rendering
  formCalcs: selectors.getFormCalcs(state.formCalc)
});

const dispatchProps = {
  updateTierCap: actions.updateTierCap,
  updateTierPercent: actions.updateTierPercent,
  updateTierCapacityLock: actions.updateTierCapacityLock,
  fixTierPercent: actions.fixTierPercent
};

type TierDefViewProps = {
  tierDef: MTierDef
  index: number,
  id: string,
  debug: boolean,
  tierPercentDelta: number
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & TierDefViewProps;

class TierDefViewBase extends React.Component<Props> {
  constructor(props:Props) {
    super(props);
    this.handleTierPercentChange = this.handleTierPercentChange.bind(this);
    this.handleTierCapChange = this.handleTierCapChange.bind(this);
    this.handleCapLockClick = this.handleCapLockClick.bind(this);
    this.handleFixPercentClick = this.handleFixPercentClick.bind(this);
  }

  static defaultProps = {
    index: 0
  }

  data() {
    return this.props.tierDef
  }

  handleTierCapChange(numVal:number|null, strVal:string, target:HTMLInputElement) {
    this.props.updateTierCap(this.props.id, ''+numVal);
  }

  handleTierPercentChange(numVal:number|null, strVal:string, target:HTMLInputElement) {
    this.props.updateTierPercent(this.props.id, ''+numVal);
  }

  buildTroopDefViews() {
    return this.data().troopDefs.map( (troopDef, index) => (
      // <Col key={index}>
        <TroopDefView
          troopDef={troopDef}
          tierDef={this.data()}
          id={`${this.props.id}:${troopDef.type}`}
          debug={this.props.debug}
          troopPercentDelta={this.data().troopPercentDelta()}
        />
      // </Col>
    ));
  }

  getActualTroopDefPercentsSum() {
    let sum = 0;
    this.data().troopDefs.forEach( troopDef => {
      sum += troopDef.getActualPercent(this.data().capacity)
    })
    return sum;
  }

  renderSums() {
    if( this.props.debug ) { return (
      <div className="TroopDefView">
        <label>{"Sums"}</label>
        <div className={`TroopPercent NumCell PercEntry inline nobr`}>
          <FontAwesomeIcon
            icon={'check'}
            color={'transparent'}
            fixedWidth
          />
          <span className="sum">{this.data().troopPercentSum().toFixed(6)}%</span>
        </div>
        <div className={`TroopCount NumCell inline nobr`}>
          <FontAwesomeIcon
            icon={'check'}
            color={'transparent'}
            fixedWidth
          />
          <span className="sum">{this.data().getCapFromTroopDefs()}</span>
        </div>
        <div className={'inline nobr troopPercCalculated'}>
          <span>{this.getActualTroopDefPercentsSum().toFixed(3)+'%'}</span>
        </div>
      </div>
    ) } else return null;
  }

  handleCapLockClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    this.props.updateTierCapacityLock(this.props.id, !this.data().capacityLocked);
  }

  renderTierCap() {
    return (
      <div className="TierProps NumCell nobr">
        <label>Tier Cap</label>
        <LockState
          locked={this.data().capacityLocked}
          onClick={this.handleCapLockClick}
        />
        <div className="nobr inline">
          <span className="sum">{this.data().capacity}</span>
        </div>
      </div>
    );
  }

  handleFixPercentClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    this.props.fixTierPercent(this.props.id);
  }

  fixThisPercent() {
    if( !this.data().capacityLocked && (this.props.tierPercentDelta !== 0) ) {
      return (
        <div className="PercentDelta delta inline" >
          <FontAwesomeIcon
            icon={'wrench'}
            onClick={this.handleFixPercentClick}
          />
        </div>
      );
    } else {
      return (
        <div className="PercentDelta no-delta inline" >
          <FontAwesomeIcon
            icon={'check'}
          />
        </div>
      );
    }
  }

  render() {
    let classNames = ['TierDefView'];
    const cycle = this.props.index%2===1 ? 'odd' : 'even';
    classNames.push(cycle);
    const hasDelta = (this.props.tierPercentDelta !== 0) && !this.data().capacityLocked ? 'hasDelta' : '';
    return (
      <Row className={classNames.join(' ')}>
        <div className="TierNum">
          <label className="tierLabel">{this.props.tierDef.tierNum}</label>
        </div>
        <div className={`TierProps`} >
          <div className={`TierPercent nobr ${hasDelta}`}>
            <label>Tier %</label>
            <div className="nobr inline">
              { this.fixThisPercent() }
              <NumericInput
                step={1} precision={PercentPrecision}
                snap
                min={0}
                max={100}
                value={this.data().percent}
                format={NumEntry.formatPercent}
                parse={NumEntry.parsePercent}
                onChange={this.handleTierPercentChange}
              />
            </div>
          </div>
          {this.renderTierCap()}
        </div>
        <div className="TierDefs">
          {this.buildTroopDefViews()}
          {this.renderSums()}
        </div>
      </Row>
    )
  }
}

const TierDefView = connect(
  mapStateToProps,
  dispatchProps
)(TierDefViewBase);

export { TierDefView };
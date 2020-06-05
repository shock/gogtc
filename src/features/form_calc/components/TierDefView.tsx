import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';

import * as NumEntry from '../../../lib/num-entry';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { TroopDefView } from './TroopDefView';
import { LockState } from '../../../components/LockState';
import { MTierDef } from '../models';

const mapStateToProps = (state: RootState) => ({
  // this has to be here to trigger re-rendering even though the props
  // used to render are passed from the parent.
  // TODO: figure out the right way to trigger re-rendering
  tierDefs: selectors.getTierDefs(state.formCalc)
});

const dispatchProps = {
  updateTierCap: actions.updateTierCap,
  updateTierPercent: actions.updateTierPercent,
  updateCapacityLock: actions.updateTierCapacityLock,
  updatePercentLock: actions.updateTierPercentLock
};

type TierDefViewProps = {
  tierDef: MTierDef
  index: number
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & TierDefViewProps;

class TierDefViewBase extends React.Component<Props> {
  constructor(props:Props) {
    super(props);
    this.handleTierPercentChange = this.handleTierPercentChange.bind(this);
    this.handleTierCapChange = this.handleTierCapChange.bind(this);
    this.handleCapLockClick = this.handleCapLockClick.bind(this);
    this.handlePercentLockClick = this.handlePercentLockClick.bind(this);
  }

  static defaultProps = {
    index: 0
  }

  buildTroopDefViews() {
    return this.props.tierDef.troopDefs.map( (troopDef, index) => (
      <Col key={index}>
        <TroopDefView troopDef={troopDef} />
      </Col>
    ));
  }

  data() {
    return this.props.tierDef
  }

  id() {
    return this.data().id();
  }

  handleTierCapChange(numVal:number|null, strVal:string, target:HTMLInputElement) {
    this.props.updateTierCap(this.id(), ''+numVal);
  }

  handleTierPercentChange(numVal:number|null, strVal:string, target:HTMLInputElement) {
    this.props.updateTierPercent(this.id(), ''+numVal);
  }

  handleCapLockClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    this.props.updateCapacityLock(this.id(), !this.data().capacityLocked);
  }

  handlePercentLockClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    this.props.updatePercentLock(this.id(), !this.data().percentLocked);
  }

  render() {
    let classNames = ['TierDefView'];
    const cycle = this.props.index%2===1 ? 'odd' : 'even';
    classNames.push(cycle);
    return (
      <Row className={classNames.join(' ')}>
        <Col sm={2}>
          <label className="tierLabel">{this.props.tierDef.tierNum}</label>
        </Col>
        <Col>
          <div className="TierProps">
            <label>Tier %</label>
            <div className="nobr">
              {/* <LockState
                locked={this.data().percentLocked}
                onClick={this.handlePercentLockClick}
              /> */}
              <NumericInput
                step={0.1} precision={3}
                snap
                min={0}
                max={100}
                value={this.data().percent}
                format={NumEntry.formatPercent}
                parse={NumEntry.parsePercent}
                onChange={this.handleTierPercentChange}
              />
            </div>
            <label>Tier Cap</label>
            <div className="nobr">
              <LockState
                locked={this.data().capacityLocked}
                onClick={this.handleCapLockClick}
              />
              <NumericInput
                step={100}
                // className={troopDef.type}
                min={0}
                max={999999}
                value={this.data().capacity}
                format={NumEntry.formatInteger}
                parse={NumEntry.parseInteger}
                onChange={this.handleTierCapChange}
              />
            </div>
          </div>
        </Col>
        <Col sm={8}>
        {this.buildTroopDefViews()}
        </Col>
      </Row>
    )
  }
}

const TierDefView = connect(
  mapStateToProps,
  dispatchProps
)(TierDefViewBase);

export { TierDefView };
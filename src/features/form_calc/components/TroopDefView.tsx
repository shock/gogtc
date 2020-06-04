import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import NumericInput from 'react-numeric-input';

import * as NumEntry from '../../../lib/num-entry';
import * as selectors from '../selectors';
import * as actions from '../actions';
import { MTroopDef } from '../models';
import { LockState } from '../../../components/LockState';

const mapStateToProps = (state: RootState) => ({
  troopDefs: selectors.getTroopDefs(state.formCalc)
});

const dispatchProps = {
  updateTroopCount: actions.updateTroopCount,
  updateTroopPercent: actions.updateTroopPercent,
  updateCountLock: actions.updateTroopCountLock,
  updatePercentLock: actions.updateTroopPercentLock
};

type TroopDefViewProps = {
  troopDef: MTroopDef
}


type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & TroopDefViewProps;

class TroopDefViewBase extends React.Component<Props> {

  constructor(props:Props) {
    super(props);
    this.handleCountChange = this.handleCountChange.bind(this);
    this.handlePercentChange = this.handlePercentChange.bind(this);
    this.handleCountLockClick = this.handleCountLockClick.bind(this);
    this.handlePercentLockClick = this.handlePercentLockClick.bind(this);
  }

  data() {
    return this.props.troopDefs[this.props.troopDef.id()];
  }

  label(troopDef:MTroopDef) {
    return `${troopDef.type}`.trim();
  }

  id() { return this.props.troopDef.id() }

  handleCountChange(numVal:number|null, strVal:string, target:HTMLInputElement) {
    this.props.updateTroopCount(this.id(), ''+numVal);
  }

  handlePercentChange(numVal:number|null, strVal:string, target:HTMLInputElement) {
    this.props.updateTroopPercent(this.id(), ''+numVal);
  }

  handleCountLockClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    this.props.updateCountLock(this.id(), !this.data().countLocked);
  }

  handlePercentLockClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    this.props.updatePercentLock(this.id(), !this.data().percentLocked);
  }

  render() {
    const troopDef = this.data();
    if( !troopDef ) return <div/>;
    return (
      <div className="TroopDefView">
        <label>{this.data().type}</label>
        <div className={`TroopPercent NumEntry PercEntry inline nobr`}>
          <LockState
            locked={this.data().percentLocked}
            onClick={this.handlePercentLockClick}
          />
          <NumericInput
            step={0.1} precision={3}
            snap
            className={troopDef.type}
            min={0}
            max={100}
            value={troopDef.percent}
            format={NumEntry.formatPercent}
            parse={NumEntry.parsePercent}
            onChange={this.handlePercentChange}
          />
        </div>
        <div className={`TroopCount NumEntry inline nobr`}>
          <LockState
            locked={this.data().countLocked}
            onClick={this.handleCountLockClick}
          />
          <NumericInput
            step={100}
            className={troopDef.type}
            min={0}
            max={999999}
            value={troopDef.count}
            format={NumEntry.formatInteger}
            parse={NumEntry.parseInteger}
            onChange={this.handleCountChange}
          />
        </div>
      </div>
    )
  }
}

const TroopDefView =  connect(
  mapStateToProps,
  dispatchProps
)(TroopDefViewBase);

export { TroopDefView };
import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import NumericInput from 'react-numeric-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as NumEntry from '../../../lib/num-entry';
import * as selectors from '../selectors';
import * as actions from '../actions';
import { MTroopDef, MTierDef } from '../models';
import { LockState } from '../../../components/LockState';

const mapStateToProps = (state: RootState) => ({
  troopDefs: selectors.getTroopDefs(state.formCalc)
});

const dispatchProps = {
  updateTroopCount: actions.updateTroopCount,
  updateTroopPercent: actions.updateTroopPercent,
  updateCountLock: actions.updateTroopCountLock,
  fixTroopPercent: actions.fixTroopPercent
};

type TroopDefViewProps = {
  troopDef: MTroopDef,
  tierDef: MTierDef
}


type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & TroopDefViewProps;

class TroopDefViewBase extends React.Component<Props> {

  constructor(props:Props) {
    super(props);
    this.handleCountChange = this.handleCountChange.bind(this);
    this.handlePercentChange = this.handlePercentChange.bind(this);
    this.handleCountLockClick = this.handleCountLockClick.bind(this);
    this.handleFixPercentClick = this.handleFixPercentClick.bind(this);
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

  handleFixPercentClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    this.props.fixTroopPercent(this.id());
  }

  fixThisPercent() {
    const tierDef = this.props.tierDef;
    if( !this.data().countLocked && (tierDef.troopPercentDelta() !== 0) ) {
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

  renderDebug() {
    if( this.data().debug() ) {
      const troopDef = this.data();
      const tierDef = this.props.tierDef;
      return (
        <div className={'inline nobr troopPercCalculated'}>
          <span>{troopDef.getActualPercent(tierDef.capacity).toFixed(3)+'%'}</span>
        </div>
      )
    } else return null;
  }

  render() {
    const troopDef = this.data();
    const tierDef = this.props.tierDef;
    const hasDelta = (tierDef.troopPercentDelta() !== 0) && !this.data().countLocked ? 'hasDelta' : '';
    if( !troopDef ) return <div/>;
    return (
      <div className="TroopDefView">
        <label>{this.data().type}</label>
        <div className={`TroopPercent NumCell PercEntry inline nobr ${hasDelta}`}>
          { this.fixThisPercent() }
          <NumericInput
            step={1} precision={3}
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
        <div className={`TroopCount NumCell inline nobr`}>
          <LockState
            locked={this.data().countLocked}
            onClick={this.handleCountLockClick}
          />
          <NumericInput
            step={100}
            snap
            className={troopDef.type}
            min={0}
            max={999999}
            value={troopDef.count}
            format={NumEntry.formatInteger}
            parse={NumEntry.parseInteger}
            onChange={this.handleCountChange}
          />
        </div>
        { this.renderDebug() }
      </div>
    )
  }
}

const TroopDefView =  connect(
  mapStateToProps,
  dispatchProps
)(TroopDefViewBase);

export { TroopDefView };
import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import * as selectors from '../selectors';
import * as actions from '../actions';
import { NumEntryView } from './NumEntryView';
import { PercEntryView } from './PercEntryView';
import { MTroopDef } from '../models';

const mapStateToProps = (state: RootState) => ({
  troopDefs: selectors.getTroopDefs(state.formCalc)
});

const dispatchProps = {
  updateTroopCount: actions.updateTroopCount,
  updateTroopPercent: actions.updateTroopPercent,
};

type TroopDefViewProps = {
  troopDef: MTroopDef
}


type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & TroopDefViewProps;

class TroopDefViewBase extends React.Component<Props> {

  data() {
    return this.props.troopDefs[this.props.troopDef.id()];
  }

  label(troopDef:MTroopDef) {
    return `${troopDef.type}`.trim();
  }

  render() {
    const troopDef = this.data();
    if( !troopDef ) return <div/>;
    return (
      <div className="TroopDefView">
        <PercEntryView
          // key={troopDef.id()}
          id={troopDef.id()+':percent'}
          value={''+troopDef.percent}
          label={this.label(troopDef)}
          updateAction={this.props.updateTroopPercent}
        />
        <NumEntryView
          // key={troopDef.id()}
          id={troopDef.id()+':count'}
          value={''+troopDef.count}
          label={this.label(troopDef)}
          updateAction={this.props.updateTroopCount}
        />
      </div>
    )
  }
}

const TroopDefView =  connect(
  mapStateToProps,
  dispatchProps
)(TroopDefViewBase);

export { TroopDefView };
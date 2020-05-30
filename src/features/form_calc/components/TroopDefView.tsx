import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import * as selectors from '../selectors';
import { NumEntryView } from './NumEntryView';
import { PercEntryView } from './PercEntryView';
import { MTroopDef } from '../models';
import { NumEntry } from '../types';

const mapStateToProps = (state: RootState) => ({
  troopDefs: selectors.getNumEntries(state.formCalc)
});

const dispatchProps = {
};

type TroopDefViewProps = {
  troopDef: MTroopDef
}


type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & TroopDefViewProps;

class TroopDefViewBase extends React.Component<Props> {

  data() {
    return this.props.troopDefs[this.props.troopDef.id()];
  }

  label(troopDef:NumEntry) {
    // return `${this.props.troopDef?.tierDef?.tierNum} ${troopDef.label}`.trim();
    return `${troopDef.label}`.trim();
  }

  render() {
    const troopDef = this.data();
    if( !troopDef ) return <div/>;
    return (
      <div className="TroopDefView">
        <NumEntryView
          key={troopDef.id}
          id={troopDef.id}
          value={troopDef.value}
          label={this.label(troopDef)}
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
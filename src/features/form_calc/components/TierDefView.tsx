import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';

import * as selectors from '../selectors';
import { NumEntryView } from './NumEntryView';
import { TroopDefView } from './TroopDefView';
import { MTierDef } from '../models';

const mapStateToProps = (state: RootState) => ({
  formCalc: selectors.getNumEntries(state.formCalc)
});

const dispatchProps = {
};

type TierDefViewProps = {
  tierDef: MTierDef
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & TierDefViewProps;

class TierDefViewBase extends React.Component<Props> {

  componentDidMount() {
  }

  numEntryViews() {
    const ids = Object.keys(this.props.formCalc);
    return ids.map( (id:string) => {
      const ne = this.props.formCalc[id];
      return <NumEntryView
        key={ne.id}
        id={id}
        value={this.props.formCalc[id].value}
        label={ne.label}
      />
    });
  }

  buildTroopDefViews() {
    return this.props.tierDef.troopDefs.map( (troopDef) => (
      <TroopDefView troopDef={troopDef} />
    ));
  }

  render() {
    return (
      <div className="TierDefView">
        <fieldset>
          <label>Tier {this.props.tierDef.tierNum}</label>
          {this.buildTroopDefViews()}
        </fieldset>
      </div>
    )
  }
}

const TierDefView =  connect(
  mapStateToProps,
  dispatchProps
)(TierDefViewBase);

export { TierDefView };
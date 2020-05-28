import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import * as selectors from '../selectors';
import { NumEntryView } from './NumEntryView';
import { TroopDefView } from './TroopDefView';
import { MTierDef, MFormCalc } from '../models';

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
      <TroopDefView tierNum={troopDef.tierNum} type={troopDef.type} />
    ));
    return [];
  }

  render() {
    return this.buildTierDefViews();
  }

  render() {
    return (
      <div className="TierDefView">
        <fieldset>

        </fieldset>
        {this.numEntryViews()}
      </div>
    )
  }
}

const TierDefView =  connect(
  mapStateToProps,
  dispatchProps
)(TierDefViewBase);

export { TierDefView };
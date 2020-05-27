import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import * as selectors from '../selectors';
import { NumEntryView } from './NumEntryView';
import { FormCalc, TierNum, TroopDef } from 'FormCalc';

const mapStateToProps = (state: RootState) => ({
  formCalc: selectors.getNumEntries(state.formCalc)
});

const dispatchProps = {
};

export interface TierDefProps {
  tierNum: TierNum;
  troopDefs: TroopDef[];
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & TierDefProps;

class TierDefBase extends React.Component<Props> {

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

  render() {
    return (
      <div className="TierDef">
        <fieldset>

        </fieldset>
        {this.numEntryViews()}
      </div>
    )
  }
}

const TierDef =  connect(
  mapStateToProps,
  dispatchProps
)(TierDefBase);

export { TierDef };
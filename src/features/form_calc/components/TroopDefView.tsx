import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import * as selectors from '../selectors';
import { NumEntryView } from './NumEntryView';
import { MTroopDef } from '../models';
import { NumEntry } from '../types';

const mapStateToProps = (state: RootState) => ({
  numEntries: selectors.getNumEntries(state.formCalc)
});

const dispatchProps = {
};

type TroopDefViewProps = {
  troopDef: MTroopDef
}


type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & TroopDefViewProps;

class TroopDefViewBase extends React.Component<Props> {

  componentDidMount() {
  }

  numEntryData() {
    return this.props.numEntries[this.props.troopDef.id()];
  }

  label(ned:NumEntry) {
    return `${this.props.troopDef?.tierDef?.tierNum} ${ned.label}`.trim();
  }

  render() {
    const ned = this.numEntryData();
    if( !ned ) return <div/>;
    return (
      <NumEntryView
        key={ned.id}
        id={ned.id}
        value={ned.value}
        label={this.label(ned)}
      />
    )
  }
}

const TroopDefView =  connect(
  mapStateToProps,
  dispatchProps
)(TroopDefViewBase);

export { TroopDefView };
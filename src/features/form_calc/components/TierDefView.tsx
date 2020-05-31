import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import * as actions from '../actions';
import * as selectors from '../selectors';
import { TroopDefView } from './TroopDefView';
import { NumEntryView } from './NumEntryView';
import { MTierDef } from '../models';

const mapStateToProps = (state: RootState) => ({
  // this has to be here to trigger re-rendering even though the props
  // used to render are passed from the parent.
  // TODO: figure out the right way to trigger re-rendering
  tierDefs: selectors.getTierDefs(state.formCalc)
});

const dispatchProps = {
  updateTierCap: actions.updateTierCap
};

type TierDefViewProps = {
  tierDef: MTierDef
  index: number
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & TierDefViewProps;

class TierDefViewBase extends React.Component<Props> {
  static defaultProps = {
    index: 0
  }

  buildTroopDefViews() {
    return this.props.tierDef.troopDefs.map( (troopDef, index) => (
      <Col>
        <TroopDefView key={index} troopDef={troopDef} />
      </Col>
    ));
  }

  data() {
    return this.props.tierDef
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
        <Col sm={2}>
          <div className="TierProps">
            <NumEntryView
              id={`${this.props.tierDef.id()}:tierCap`}
              value={''+this.props.tierDef.tierCap}
              label={'Tier Cap'}
              updateAction={this.props.updateTierCap}
            />

          </div>
        </Col>
        <Col>
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
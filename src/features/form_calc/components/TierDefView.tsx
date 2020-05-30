import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import * as selectors from '../selectors';
import { NumEntryView } from './NumEntryView';
import { TroopDefView } from './TroopDefView';
import { MTierDef } from '../models';

const mapStateToProps = (state: RootState) => ({
});

const dispatchProps = {
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
    return this.props.tierDef.troopDefs.map( (troopDef) => (
      <Col>
        <TroopDefView troopDef={troopDef} />
      </Col>
    ));
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
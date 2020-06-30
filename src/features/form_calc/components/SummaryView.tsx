import { RootState } from 'typesafe-actions'
import * as React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as selectors from '../selectors'
import { MFormCalc } from '../models'
import { TroopType } from '../types'

const mapStateToProps = (state: RootState) => ({
  formCalcs: selectors.getFormCalcs(state.formCalc)
})

const dispatchProps = {
}

interface SummaryViewProps {
  id: string;
  debug: boolean;
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & SummaryViewProps
type State = {
}

class SummaryViewBase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  static defaultProps = {
    debug: false
  }

  componentDidUpdate(prevProps:Props) {
  }

  data() {
    const formCalc = this.props.formCalcs[this.props.id];
    return formCalc;
  }

  summaryHeader() {
    return (
      <tr>
        <th className="name">{this.data().name}</th>
        <th className="count">Count</th>
        <th className="percent">%</th>
      </tr>
    )
  }

  troopTypeRow(type:TroopType) {
    return (
      <tr>
        <td>{type}</td>
        <td>{parseInt(this.data().getCountForType(type).toString()).toLocaleString()}</td>
        <td>{parseFloat(this.data().getPercentForType(type).toString()).toLocaleString()}%</td>

      </tr>
    )
  }

  render() {
    const formCalc = this.data()
    if( !formCalc ) {
      return (<h4>Please select a calculator</h4>)
    }
    return (
      <React.Fragment>
        <Row>
          <Col>
            <div className="SummaryView" style={{margin: '0 auto', display: 'inline-block'}}>
              <table>
                {this.summaryHeader()}
                {[TroopType.Infantry, TroopType.Cavalry, TroopType.Distance].map(type => this.troopTypeRow(type))}
              </table>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

const SummaryView = connect(
  mapStateToProps,
  dispatchProps
)(SummaryViewBase)

export { SummaryView };
import { RootState } from 'typesafe-actions'
import * as React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import NumericInput from 'react-numeric-input'

import * as NumEntry from '../../../lib/num-entry'
import { MFormCalc, MTroopDef } from '../models'
import { TierNum, TroopType, TroopTypes } from '../../../lib/fc-types'
import * as actions from '../actions'

const mapStateToProps = (state: RootState) => ({
})

const dispatchProps = {
  updateTroopCount: actions.updateTroopCount,
}

interface FormEntryViewProps {
  formCalc: MFormCalc
  debug: boolean
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & FormEntryViewProps
type State = {
}

class FormEntryViewBase extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
    }
  }

  static defaultProps = {
    debug: false
  }

  componentDidUpdate(prevProps:Props) {
  }

  data() { return this.props.formCalc }

  renderTroopDef(tierNum:TierNum, troopDef:MTroopDef) {
    const type = troopDef.type
    const id = `${this.props.formCalc.id}:${tierNum}:${type}`
    const onChange = (numVal:number|null, strVal:string, target:HTMLInputElement) => {
      this.props.updateTroopCount(id, ''+numVal)
    }

    return (
      <Row>
        <Col xs={1}>
          {tierNum}
        </Col>
        <Col sm={1}>
          <NumericInput
            step={100}
            snap
            className={`${troopDef.type} troop-entry`}
            min={0}
            max={999999}
            value={troopDef.count.toString()}
            format={NumEntry.formatInteger}
            parse={NumEntry.parseInteger}
            onChange={onChange}
            onFocus={NumEntry.onFocus}
            tabIndex={3}
          />
        </Col>
      </Row>
    )
  }

  renderTroopView(troopType: TroopType) {
    return (
      <Row className="FEV-troop-view">
        <Col sm='auto'><h3 className='troop-type'>{troopType}</h3></Col>
        <Col>
          {
            this.data().getTroopDefsForType(troopType).map(
              obj => this.renderTroopDef(obj.tierNum, obj.troopDef)
            )
          }
        </Col>
      </Row>
    )
  }

  renderTroopViews() {
    return TroopTypes.map(troopType => this.renderTroopView(troopType))
  }

  render() {
    if( !this.data() ) {
      return (<h4>Please select a calculator</h4>)
    }

    return (
      <React.Fragment>
        <Row className="FormEntryView">
          <Col>
            {this.renderTroopViews()}
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

const FormEntryView = connect(
  mapStateToProps,
  dispatchProps
)(FormEntryViewBase)

export { FormEntryView }
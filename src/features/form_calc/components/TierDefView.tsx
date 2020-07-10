import { RootState } from 'typesafe-actions'
import * as React from 'react'
import { connect } from 'react-redux'
import { Row } from 'react-bootstrap'
import NumericInput from 'react-numeric-input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import * as NumEntry from '../../../lib/num-entry'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { TroopDefView } from './TroopDefView'
import { LockState } from './LockState'
import { MTierDef } from '../models'
import { getFormCalcId } from '../lib/IdParser'
import config from '../../../config'

const mapStateToProps = (state: RootState) => ({
  formCalcs: selectors.getFormCalcs(state.formCalc),
})

const dispatchProps = {
  updateTierPercent: actions.updateTierPercent,
  updateTierCapacityLock: actions.updateTierCapacityLock,
  fixTierPercent: actions.fixTierPercent
}

type TierDefViewProps = {
  tierDef: MTierDef
  index: number,
  id: string,
  debug: boolean,
  hasTierPercentDelta: boolean
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & TierDefViewProps

class TierDefViewBase extends React.Component<Props> {
  constructor(props:Props) {
    super(props)
    this.handleTierPercentChange = this.handleTierPercentChange.bind(this)
    this.handleCapLockClick = this.handleCapLockClick.bind(this)
    this.handleFixPercentClick = this.handleFixPercentClick.bind(this)
  }

  static defaultProps = {
    index: 0
  }

  data() {
    return this.props.tierDef
  }

  formCalc() {
    return this.props.formCalcs[getFormCalcId(this.props.id)]
  }

  handleTierPercentChange(numVal:number|null, strVal:string, target:HTMLInputElement) {
    this.props.updateTierPercent(this.props.id, ''+numVal)
  }

  buildTroopDefViews() {
    return this.data().troopDefs.map( (troopDef, index) => (
      <TroopDefView
        troopDef={troopDef}
        tierDef={this.data()}
        key={index}
        id={`${this.props.id}:${troopDef.type}`}
        debug={this.props.debug}
        hasTroopPercentDelta={this.data().hasTroopPercentDelta()}
      />
    ))
  }

  renderSums() {
    if( this.props.debug ) { return (
      <div className="TroopDefView">
        <label>{"Sums"}</label>
        <div className={`TroopPercent NumCell PercEntry inline nobr`}>
          <FontAwesomeIcon
            icon={'check'}
            color={'transparent'}
            fixedWidth
          />
          <span className="sum">{this.data().troopPercentSum().toFixed(config.calcPrecision)}%</span>
        </div>
        <div className={`TroopCount NumCell inline nobr`}>
          <FontAwesomeIcon
            icon={'check'}
            color={'transparent'}
            fixedWidth
          />
          <span className="sum">{this.data().getCapFromTroopDefs().toString()}</span>
        </div>
        <div className={'inline nobr troopPercCalculated'}>
          <span>{this.data().getActualTroopDefPercentSum().toFixed(config.calcPrecision)}%</span>
        </div>
      </div>
    ) } else return null
  }

  handleCapLockClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    this.props.updateTierCapacityLock(this.props.id, !this.data().capacityLocked)
  }

  handleFixPercentClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    this.props.fixTierPercent(this.props.id)
  }

  fixThisPercent() {
    if( !this.data().capacityLocked  && this.props.hasTierPercentDelta ) {
      return (
        <div className="PercentDelta delta inline" >
          <FontAwesomeIcon
            icon={'wrench'}
            onClick={this.handleFixPercentClick}
            fixedWidth
          />
        </div>
      )
    } else {
      return (
        <LockState
          locked={this.data().capacityLocked}
          onClick={this.handleCapLockClick}
        />
      )
    }
  }

  renderTierCap() {
    return (
      <div className="TierProps nobr">
        <label>Tier Cap</label>
        <div className='PercentDelta inline'>
          <FontAwesomeIcon
            icon={'check'}
            fixedWidth
            color='transparent'
          />
        </div>
        <div className="nobr inline">
          <span className="sum">{this.data().capacity.toString()}</span>
        </div>
      </div>
    )
  }

  renderTierPercent() {
    return (
      <div className="TierProps nobr">
        <label>Actual Tier %</label>
        <div className='PercentDelta inline'>
          <FontAwesomeIcon
            icon={'check'}
            fixedWidth
            color='transparent'
          />
        </div>
        <div className="nobr inline">
          <span className="sum">{this.formCalc().getActualTierPercent(this.data()).toFixed(config.calcPrecision)}%</span>
        </div>
      </div>
    )
  }

  render() {
    const tierDef = this.data()
    let classNames = ['TierDefView']
    const cycle = this.props.index%2===1 ? 'odd' : 'even'
    classNames.push(cycle)
    const hasDelta = this.props.hasTierPercentDelta && !tierDef.capacityLocked ? 'hasDelta' : ''
    const locked = tierDef.capacityLocked ? "locked" : ''
    return (
      <Row className={classNames.join(' ')}>
        <div className="TierNum">
          <label className="tierLabel">{this.props.tierDef.tierNum}</label>
        </div>
        <div className={`TierProps`} >
          <div className={`TierPercent nobr ${hasDelta} ${locked}`}>
            <label>Alloc Tier %</label>
            <div className="nobr inline">
              { this.fixThisPercent() }
              <NumericInput
                step={1} precision={config.viewPrecision}
                snap
                min={0}
                max={100}
                value={tierDef.capacityLocked ? '' : tierDef.percent.toString()}
                format={NumEntry.formatPercent}
                parse={NumEntry.parsePercent}
                onChange={this.handleTierPercentChange}
                onFocus={NumEntry.onFocus}
                tabIndex={1}
              />
            </div>
          </div>
          {this.renderTierPercent()}
          {this.renderTierCap()}
        </div>
        <div className="TierDefs">
          {this.buildTroopDefViews()}
          {this.renderSums()}
        </div>
      </Row>
    )
  }
}

const TierDefView = connect(
  mapStateToProps,
  dispatchProps
)(TierDefViewBase)

export { TierDefView }
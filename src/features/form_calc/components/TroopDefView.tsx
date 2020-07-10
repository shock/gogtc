import { RootState } from 'typesafe-actions'
import * as React from 'react'
import { connect } from 'react-redux'
import NumericInput from 'react-numeric-input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import * as NumEntry from '../../../lib/num-entry'
import * as actions from '../actions'
import { MTroopDef, MTierDef } from '../models'
import { LockState } from './LockState'
import config from '../../../config'

const mapStateToProps = (state: RootState) => ({
})

const dispatchProps = {
  updateTroopCount: actions.updateTroopCount,
  updateTroopPercent: actions.updateTroopPercent,
  updateCountLock: actions.updateTroopCountLock,
  fixTroopPercent: actions.fixTroopPercent
}

type TroopDefViewProps = {
  troopDef: MTroopDef,
  tierDef: MTierDef,
  id: string,
  debug: boolean,
  hasTroopPercentDelta: boolean
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & TroopDefViewProps

class TroopDefViewBase extends React.Component<Props> {

  constructor(props:Props) {
    super(props)
    this.handleCountChange = this.handleCountChange.bind(this)
    this.handlePercentChange = this.handlePercentChange.bind(this)
    this.handleCountLockClick = this.handleCountLockClick.bind(this)
    this.handleFixPercentClick = this.handleFixPercentClick.bind(this)
  }

  data() {
    return this.props.troopDef
  }

  label(troopDef:MTroopDef) {
    return `${troopDef.type}`.trim()
  }

  handleCountChange(numVal:number|null, strVal:string, target:HTMLInputElement) {
    this.props.updateTroopCount(this.props.id, ''+numVal)
  }

  handlePercentChange(numVal:number|null, strVal:string, target:HTMLInputElement) {
    this.props.updateTroopPercent(this.props.id, ''+numVal)
  }

  handleCountLockClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    this.props.updateCountLock(this.props.id, !this.data().countLocked)
  }

  handleFixPercentClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    this.props.fixTroopPercent(this.props.id)
  }

  fixThisPercent() {
    if( !this.data().countLocked && this.props.hasTroopPercentDelta ) {
      return (
        <div className="PercentDelta delta inline" >
          <FontAwesomeIcon
            icon={'wrench'}
            fixedWidth
            onClick={this.handleFixPercentClick}
          />
        </div>
      )
    } else {
      return (
        <div className="PercentDelta no-delta inline" >
          <FontAwesomeIcon fixedWidth icon={'check'} />
        </div>
      )
    }
  }

  renderDebug() {
    if( this.props.debug ) {
      const troopDef = this.data()
      const tierDef = this.props.tierDef
      return (
        <div className={'inline nobr troopPercCalculated'}>
          <span>{troopDef.getActualPercent(tierDef.capacity).toFixed(config.calcPrecision)+'%'}</span>
        </div>
      )
    } else return null
  }

  render() {
    const troopDef = this.data()
    if( !troopDef ) return <div/>
    const locked = troopDef.countLocked ? "locked" : ''
    const hasDelta = this.props.hasTroopPercentDelta && !troopDef.countLocked ? 'hasDelta' : ''
    return (
      <div className="TroopDefView">
        <label>{this.data().type}</label>
        <div className={`TroopPercent NumCell PercEntry inline nobr ${hasDelta} ${locked}`}>
          { this.fixThisPercent() }
          <NumericInput
            step={1} precision={config.viewPrecision}
            snap
            className={troopDef.type}
            min={0}
            max={100}
            value={troopDef.countLocked ? '' : troopDef.percent.toString()}
            format={NumEntry.formatPercent}
            parse={NumEntry.parsePercent}
            onChange={this.handlePercentChange}
            onFocus={NumEntry.onFocus}
            tabIndex={2}
          />
        </div>
        <div className={`TroopCount NumCell inline nobr`}>
          <LockState
            locked={this.data().countLocked}
            onClick={this.handleCountLockClick}
          />
          <NumericInput
            step={1000}
            snap
            className={troopDef.type}
            min={0}
            max={999999}
            value={troopDef.count.toString()}
            format={NumEntry.formatInteger}
            parse={NumEntry.parseInteger}
            onChange={this.handleCountChange}
            onFocus={NumEntry.onFocus}
            tabIndex={3}
          />
        </div>
        { this.renderDebug() }
      </div>
    )
  }
}

const TroopDefView =  connect(
  mapStateToProps,
  dispatchProps
)(TroopDefViewBase)

export { TroopDefView }
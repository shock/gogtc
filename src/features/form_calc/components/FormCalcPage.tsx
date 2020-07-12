import { RootState } from 'typesafe-actions'
import * as React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Form, Button, Overlay, OverlayProps, Card } from 'react-bootstrap'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { UserRoles } from '../../../client_server/interfaces/User'
import * as actions from '../actions'
import { showAlert } from '../../modals/actions'
import { showGeneralModal } from '../../modals/actions'
import * as selectors from '../selectors'
import { currentUser} from '../../users/selectors'
import { CalculatorView } from './CalculatorView'
import { FormEntryView } from './FormEntryView'
import { MFormCalc } from '../models'
import TT from '../../../components/tooltips'
import { SummaryView } from './SummaryView'
import { CalcView } from '../../../lib/fc-types'

type SettingsProps = Omit<OverlayProps, 'children'>

const SettingsOverlay = (props:OverlayProps) => {
  return (
    <Overlay
      {...props}
      rootClose={true}
    >
      <Card>
        <Card.Body>
          {props.children}
        </Card.Body>
      </Card>
    </Overlay>
  )
}

const mapStateToProps = (state: RootState) => ({
  formCalcs: selectors.getFormCalcs(state.formCalc),
  currentId: selectors.getCurrentId(state.formCalc),
  currentUser: currentUser(state.users)
})

const dispatchProps = {
  resetState: actions.resetState,
  clearUndoHistory: UndoActionCreators.clearHistory,
  setFcId: actions.setFcId,
  showAlert: showAlert,
  showModal: showGeneralModal,
  loadUserCalcs: actions.loadUserCalcsAsync.request
}

interface FormCalcPageProps {
  fcId: string
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & FormCalcPageProps

type State = {
  fcId: string,
  debug: boolean,
  showSettings: boolean,
  view: CalcView
}

class FormCalcPageBase extends React.Component<Props, State> {
  private settingsTarget = React.createRef<HTMLDivElement>()

  constructor(props: Props) {
    super(props)
    this.state = {
      fcId: this.props.fcId,
      debug: false,
      showSettings: false,
      view: 'calculator'
    }
    this.handleNameSubmit = this.handleNameSubmit.bind(this)
  }

  formCalc() { return this.props.formCalcs[this.state.fcId] }
  currentUser() { return this.props.currentUser }
  isAdmin() { return this.currentUser()?.role === UserRoles.Admin }

  componentDidUpdate(prevProps:Props) {
    if(prevProps.fcId !== this.props.fcId) {
      this.setState({fcId: this.props.fcId})
    }
    if(prevProps.currentId !== this.props.currentId) {
      this.setState({fcId: this.props.currentId})
    }
  }

  componentDidMount() {
    if( !this.formCalc() ) {
      this.resetReduxState()
    }
    this.props.loadUserCalcs()
  }

  resetReduxState() {
    const formCalc = this.props.formCalcs[this.state.fcId]
    if( formCalc ) {
      this.props.resetState(this.state.fcId, formCalc.clone())
      this.props.clearUndoHistory()
      return
    }
    if( this.state.debug )
      this.props.showModal('Error', `No MFormCalc found with id '${this.state.fcId}'`, )
  }

  handleNameSubmit(event: any) {
    const formCalc = this.props.formCalcs[this.state.fcId]
    if( !formCalc ) {
      alert(`Couldn't find model with id: '${this.state.fcId}'`)
      return
    }
    setTimeout( ()  => this.resetReduxState(), 0)
    this.props.setFcId(this.state.fcId)
  }

  selectOptions() {
    const formCalcs = Object.values(this.props.formCalcs)
    const presetCalcs = formCalcs.filter(fc => fc.preset)
    const userCalcs = formCalcs.filter(fc => !fc.preset)
    let index = 0
    const markedName = (formCalc:MFormCalc) => {
      if( formCalc.isChanged() ) {
        return `${formCalc.name} *`
      } else { return formCalc.name}
    }
    const mapOptions = (formCalcs:MFormCalc[]) => formCalcs.map(formCalc => {
      // this docs for Form.Control select say setting defaultValue handles the selected option,
      // but I can't get it to work
      const selected = (formCalc.id === this.props.currentId)
      return <option key={index++} value={formCalc.id} selected={selected}>{markedName(formCalc)}</option>
    })

    const userOptions = mapOptions(userCalcs)
    const presetOptions = mapOptions(presetCalcs)
    const placeHolder = this.props.currentId === ''
      ? <option value={''}>Select a Calculator to Load</option>
      : null
    return (
      <>
        {placeHolder}
        <optgroup label="Preset Calculators">
          {presetOptions}
        </optgroup>
        <optgroup label="MyCalculators">
          {userOptions}
        </optgroup>
      </>
    )
  }

  syntaxHighlight(json:string) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
        var cls = 'number'
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key'
            } else {
                cls = 'string'
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean'
        } else if (/null/.test(match)) {
            cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
    })
  }

  renderJsonView() {
    const obj = this.formCalc().toJsonObject()
    if( !obj ) { return <h4>Please load a calculator.</h4> }
    const json = JSON.stringify(obj, null, 2)
    return (
      <Row>
        <Col style={{textAlign: 'left'}}>
          <pre className="JsonView" dangerouslySetInnerHTML={{ __html: this.syntaxHighlight(json) }} />
        </Col>
      </Row>
    )
  }

  renderCalcView() {
    return (
      <Row>
        <Col>
          <CalculatorView id={this.state.fcId} debug={this.state.debug}/>
        </Col>
      </Row>
    )
  }

  renderFormEntryView() {
    return (
      <Row>
        <Col>
          <FormEntryView formCalc={this.formCalc()} debug={this.state.debug}/>
        </Col>
      </Row>
    )
  }

  renderViewSelect() {
    const capitalize = (s:string) => {
      return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const opt_vals  = ['json', 'summary', 'calculator', 'troop_entry']
      .filter(val => ( this.isAdmin() || (val !== 'json') ) )

    const options = opt_vals.map(val => {
      const selected = this.state.view === val
      return (
        <option value={val} selected={selected}>{val.split('_').map(capitalize).join(' ')}</option>
      )
    })

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      this.setState({view: value as CalcView})
    }

    return (
      <Form.Group controlId="formName" className='FCP-view-select FCP-select'>
        <Form.Label>View</Form.Label>
        <Form.Control
          as="select"
          custom
          onChange={onChange}
          defaultValue={this.state.view}
        >{options}</Form.Control>
      </Form.Group>
    )
  }

  renderActions() {
    const onDebugClick = (e:any) => {
      this.setState({debug: !this.state.debug})
    }
    // const debugButton = (
    //   <Button
    //     variant={this.state.debug ? "secondary" : "info"}
    //     onClick={onDebugClick}
    //   >Debug</Button>
    // )
    const debugButton = (
      <Form.Check
        type='checkbox'
        id='set-db-cb'
        checked={this.state.debug}
        onChange={onDebugClick}
        label='Debug'
      />
    )
    const dMsg = 'Show Debug Info'
    const onSettingsClick = (e:any) => {
      console.log('CLICK!')
      this.setState({showSettings: !this.state.showSettings})
    }
    const settingsButton = (
      <Button
        variant={this.state.showSettings ? "secondary" : "info"}
        onClick={onSettingsClick}
      ><FontAwesomeIcon icon='cog' /></Button>
    )
    return (
      <div ref={this.settingsTarget }>
        {this.renderViewSelect()}
        &nbsp;&nbsp;&nbsp;
        {settingsButton}
        <SettingsOverlay
          show={this.state.showSettings}
          target={this.settingsTarget.current}
          placement='bottom-end'
          onHide={() => this.setState({showSettings: false})}
        >
          <>
            <TT tip={dMsg}>{debugButton}</TT>
          </>
        </SettingsOverlay>
      </div>
    )
  }

  renderSettings() {

  }

  renderView() {
    switch( this.state.view ) {
      case 'json' :
        return this.renderJsonView()
      case 'summary' :
        return <SummaryView id={this.state.fcId} debug={this.state.debug}/>
      case 'troop_entry' :
        return this.renderFormEntryView()
      default:
        return this.renderCalcView()
    }
  }

  render() {
    const onSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({fcId: event.target.value}, () => this.handleNameSubmit(event))
    }

    return (
      <React.Fragment>
        <Row className='controls-row'>
          <Col>
            <Form onSubmit={this.handleNameSubmit}>
              <Form.Group controlId="formName" className="FCP-form-select FCP-select">
                <Form.Label>Load</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  onChange={onSelectChange}
                  defaultValue={this.props.currentId}
                >
                  {this.selectOptions()}
                </Form.Control>
              </Form.Group>
            </Form>
          </Col>
          <Col sm='auto'>
            {this.formCalc() ? this.renderActions() : null}
          </Col>
        </Row>
        {this.renderView()}
      </React.Fragment>
    )
  }
}

const FormCalcPage = connect(
  mapStateToProps,
  dispatchProps
)(FormCalcPageBase)

export { FormCalcPage }
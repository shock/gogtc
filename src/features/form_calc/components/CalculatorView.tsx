import { RootState } from 'typesafe-actions'
import * as React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Form, Button } from 'react-bootstrap'
import NumericInput from 'react-numeric-input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import * as NumEntry from '../../../lib/num-entry'
import * as actions from '../actions'
import * as selectors from '../selectors'
import * as usersSelector from '../../users/selectors'
import { UserRoles } from '../../../client_server/interfaces/User'
import { TierDefView } from './TierDefView'
import config from '../../../config'
import UndoRedo from './UndoRedo'

const mapStateToProps = (state: RootState) => ({
  currentUser: usersSelector.currentUser(state.users),
  formCalcs: selectors.getFormCalcs(state.formCalc),
});

const dispatchProps = {
  resetState: actions.resetState,
  updateName: actions.updateName,
  updateMarchCap: actions.updateMarchCap,
  updatePresetFlag: actions.updatePresetFlag,
  saveFormCalc: actions.saveFormCalc
};

interface CalculatorViewProps {
  id: string;
  debug: boolean;
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & CalculatorViewProps;
type State = {
  name: string
  editingName: boolean
}

class CalculatorViewBase extends React.Component<Props, State> {
  private nameInputRef = React.createRef<HTMLInputElement>()

  constructor(props: Props) {
    super(props);
    this.state = {
      name: this.data()?.name,
      editingName: false
    }
  }

  static defaultProps = {
    debug: false
  }

  componentDidUpdate(prevProps:Props) {
    if((this.props.formCalcs != prevProps.formCalcs) || ( this.id() !== prevProps.id )) {
      this.setState({
        name: this.data()?.name,
        editingName: false
      })
    }
  }

  id():string { return this.props.id }

  data() {
    const formCalc = this.props.formCalcs[this.id()]
    return formCalc;
  }

  isPreset() { return this.data()?.preset }

  currentUser() { return this.props.currentUser }

  isAdmin() { return this.currentUser()?.role === UserRoles.Admin }

  buildTierDefViews() {
    return this.data().tierDefs.map( (tierDef, index) => {
      return (
        <TierDefView
          id={`${this.id()}:${tierDef.tierNum}`}
          hasTierPercentDelta={this.data().hasTierPercentDelta()}
          key={index}
          tierDef={tierDef}
          index={index}
          debug={this.props.debug}
        />
      );
    });
  }

  renderDebug() {
    if( !this.data() ) return (null);
    const formCalc = this.data();
    if( this.props.debug ) {
      return (
        <Row>
          <Col>
            <div className="NumCell inline nobr">
              <label>Troops Sum</label>
              <span className="sum">{formCalc.getCapFromTierDefs().toString()}</span>
            </div>
            <div className="NumCell inline nobr">
              <label>Tier % Sum</label>
              <span className="sum">{formCalc.getTierDefPercentsSum().toFixed(config.calcPrecision)}</span>
            </div>
          </Col>
        </Row>
      )
    } else return null
  }

  renderName() {
    const onChange = (event:React.ChangeEvent<HTMLInputElement>) => this.setState({name: event.target.value})
    const onKeyUp = (event:React.KeyboardEvent<HTMLInputElement>) => {
      if( event.keyCode === 27 ) {
        this.setState({editingName: false, name: this.data().name} )
      }
    }
    const nameSubmit = (e:any) => {
      this.setState({editingName: false})
      if( this.state.name !== this.data().name ) {this.props.updateName(this.id(), this.state.name)}
    }
    const nameClick = (e:any) => {
      this.setState({editingName: true}, () => {
        const node = this.nameInputRef.current
        if( node ) { node.focus() }
      })
    }
    if( this.state.editingName ) {
      return (
        <Form onSubmit={nameSubmit}>
          <Form.Control
            as="input"
            value={this.state.name}
            onChange={onChange}
            onKeyUp={onKeyUp}
            ref={this.nameInputRef}
          />
          <Button variant="primary" onClick={nameSubmit}>OK</Button>
        </Form>
      )
    } else {
      return (
        <div onClick={nameClick}>
          <span className="fcName">{this.state.name}</span>
          <span className="fcNicon"><FontAwesomeIcon icon={'pencil-alt'} fixedWidth/></span>
        </div>
      )
    }
  }

  renderSave() {
    const disabled = !this.data()?.isChanged()
    const onClick = () => this.props.saveFormCalc(this.data())
    return (
      <Col sm={1}>
        <Button
          variant='info'
          disabled={disabled}
          onClick={onClick}
        >SAVE</Button>
      </Col>
    )
  }

  renderAdminRow() {
    const admin = this.isAdmin()
    const onClick = (e:any) => {
      this.props.updatePresetFlag(this.id(), !this.isPreset())
    }
    if( admin ) {
      return (
        <Row>
          <Col>
            <Form.Group>
              <Form.Check
                checked={this.data().preset}
                label="Preset"
                onClick={onClick}
              />
            </Form.Group>
          </Col>
        </Row>
      )
    } else { return (null) }
  }

  render() {
    if( !this.data() ) {
      if( this.props.debug ) {
        return (<h4>Can't find form calc with id '{this.id()}'</h4>)
      } else {
        return (<h4>Please select a calculator</h4>)
      }
    }
    const formCalc = this.data();
    const marchCapChange = (numVal:number|null, strVal:string, target:HTMLInputElement) => {
      this.props.updateMarchCap(this.id(), ''+numVal);
    }

    return (
      <React.Fragment>
        <Row>
          <Col sm={5} className="fcNameForm">
            {this.renderName()}
          </Col>
          {this.renderSave()}
          <Col >
            <label>March Cap</label>&nbsp;
            <NumericInput
              step={1000}
              snap
              min={0}
              max={999999}
              value={formCalc.marchCap.toString()}
              format={NumEntry.formatInteger}
              parse={NumEntry.parseInteger}
              onChange={marchCapChange}
              onFocus={NumEntry.onFocus}
            />
          </Col>
          <Col sm={2}>
            <UndoRedo/>
          </Col>
        </Row>
        {this.renderAdminRow()}
        {this.renderDebug()}
        <Row>
          <Col>
            {this.buildTierDefViews()}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const CalculatorView = connect(
  mapStateToProps,
  dispatchProps
)(CalculatorViewBase);

export { CalculatorView };
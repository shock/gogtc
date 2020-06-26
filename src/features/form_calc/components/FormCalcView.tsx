import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as NumEntry from '../../../lib/num-entry';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { TierDefView } from './TierDefView';
import config from '../../../config';
import UndoRedo from './UndoRedo';

const mapStateToProps = (state: RootState) => ({
  formCalcs: selectors.getFormCalcs(state.formCalc)
});

const dispatchProps = {
  resetState: actions.resetState,
  updateMarchCap: actions.updateMarchCap,
};

interface FormCalcViewProps {
  id: string;
  debug: boolean;
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & FormCalcViewProps;
type State = {
  name: string
  editingName: boolean
}

class FormCalcViewBase extends React.Component<Props, State> {
  private nameInputRef = React.createRef<HTMLInputElement>()

  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      editingName: false
    }
    this.handleMarchCapChange = this.handleMarchCapChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleNameSubmit = this.handleNameSubmit.bind(this)
    this.handleNameClick = this.handleNameClick.bind(this)
  }

  static defaultProps = {
    debug: false
  }

  componentDidUpdate(prevProps:Props) {
    if((this.props.formCalcs != prevProps.formCalcs) || ( this.props.id !== prevProps.id )) {
      this.setState({
        name: this.data()?.name,
        editingName: false
      })
    }
  }

  id():string {
    return this.props.id;
  }

  data() {
    const formCalc = this.props.formCalcs[this.props.id];
    return formCalc;
  }

  hasModel() {
    return this.data() !== undefined;
  }

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

  handleMarchCapChange(numVal:number|null, strVal:string, target:HTMLInputElement) {
    this.props.updateMarchCap(this.props.id, ''+numVal);
  }

  renderDebug() {
    if( !this.data() ) return (null);
    const formCalc = this.data();
    if( this.props.debug ) {
      return (
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
      );
    } else return null;
  }

  handleNameChange(event:React.ChangeEvent<HTMLInputElement>) {
    this.setState({name: event.target.value})
  }

  handleNameSubmit(e:any) {
    this.setState({editingName: false})
  }

  handleNameClick(e:any) {
    this.setState({editingName: true})

    // nameInputRef.current won't be set until the input element is rendered, so wait until the next event cycle
    setTimeout(() => {
      const node = this.nameInputRef.current
      if( node ) {
        console.log('WE BE HERE')
        node.focus()
      }
    }, 0)
  }

  renderName() {
    if( this.state.editingName ) {
      return (
        <Form onSubmit={this.handleNameSubmit}>
          <Form.Control
            as="input"
            value={this.state.name}
            onChange={this.handleNameChange}
            ref={this.nameInputRef}
          />
          <Button variant="primary" onClick={this.handleNameSubmit}>OK</Button>
        </Form>
      )
    } else {
      return (
        <div onClick={this.handleNameClick}>
          <span className="fcName">{this.state.name}</span>
          <span className="fcNicon"><FontAwesomeIcon icon={'pencil-alt'} fixedWidth/></span>
        </div>
      )
    }
  }

  render() {
    if( !this.data() ) return (null);
    const formCalc = this.data();
    return (
      <React.Fragment>
        <Row>
          <Col sm={3} className="fcNameForm">
            {this.renderName()}
          </Col>
          {this.renderDebug()}
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
              onChange={this.handleMarchCapChange}
            />
          </Col>
          <Col sm={2}>
            <UndoRedo/>
          </Col>
        </Row>
        <Row>
          <Col>
            {this.buildTierDefViews()}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const FormCalcView =  connect(
  mapStateToProps,
  dispatchProps
)(FormCalcViewBase);

export { FormCalcView };
import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { ActionCreators as UndoActionCreators } from 'redux-undo'

import * as actions from '../actions';
import { FormCalcView } from './FormCalcView';
import { TestLibrary, MFormCalc } from '../models';
import TT from '../../../lib/tooltips';

const mapStateToProps = (state: RootState) => ({
});

const dispatchProps = {
  resetState: actions.resetState,
  clearUndoHistory: UndoActionCreators.clearHistory
};

interface FormCalcSelectorProps {
  name: string
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & FormCalcSelectorProps;
type State = {
  formCalc: MFormCalc,
  formName: string,
  debug: boolean,
  showJson: boolean,
  jsonState: boolean
}

class FormCalcSelectorBase extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      formCalc: TestLibrary.formCalcs[this.props.name],
      formName: this.props.name,
      debug: false,
      showJson: false,
      jsonState: true
    }
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
    this.handleDebugClick = this.handleDebugClick.bind(this);
    this.handleJsonClick = this.handleJsonClick.bind(this);
    this.handleStateClick = this.handleStateClick.bind(this);
  }

  componentDidUpdate(prevProps:Props) {
    const formCalc = this.props.formCalcs[this.state.formName];
    if( this.state.formCalc !== formCalc ) {
      console.log('here');
      this.setState({formCalc: formCalc})
      if( TestLibrary.formCalcs[this.state.formName] !== formCalc ) {
        console.log('here too')
        // TestLibrary.formCalcs[this.state.formName] = formCalc;
      }
    }
  }

  componentDidMount() {
    if( this.state.formCalc ) { this.resetReduxState() }
  }

  resetReduxState() {
    this.props.resetState(this.state.formCalc.name, this.state.formCalc.objectForState());
    this.props.clearUndoHistory();
  }

  handleDebugClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.setState({debug: !this.state.debug});
  }

  handleJsonClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.setState({showJson: !this.state.showJson});
  }

  handleStateClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.setState({jsonState: !this.state.jsonState});
  }

  handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      formName: event.target.value
    })
  }

  handleNameSubmit(event: any) {
    event.preventDefault();
    const formCalc = TestLibrary.formCalcs[this.state.formName];
    if( !formCalc ) {
      alert(`Couldn't find model with name: '${this.state.formName}'`);
      return;
    }
    setTimeout( ()  => this.resetReduxState(), 1);
    this.setState({
      formCalc: formCalc
    });
  }

  selectOptions() {
    const options = Object.keys(TestLibrary.formCalcs).map( name => {
      const selected = this.state.formName === name;
      return (<option selected={selected}>{name}</option>);
    });
    return options;
  }

  syntaxHighlight(json:string) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  renderJsonView() {
    const obj = this.state.jsonState
      ? this.state.formCalc.asJsonObject()
      : TestLibrary.formCalcs[this.state.formName].asJsonObject();
    const json = JSON.stringify(obj, null, 2);
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
          <FormCalcView id={this.state.formCalc.name} debug={this.state.debug}/>
        </Col>
      </Row>
    )
  }

  render() {
    const debugButton = (
      <Button
        variant={this.state.debug ? "secondary" : "info"}
        onClick={this.handleDebugClick}
      >Debug</Button>
    );
    const dMsg = this.state.debug ? 'Hide Debug Info' : 'Show Debug Info';
    const jsonButton = (
      <Button
        variant={this.state.showJson ? "secondary" : "info"}
        onClick={this.handleJsonClick}
      >Json</Button>
    );
    const jMsg = this.state.showJson ? 'Hide Json' : 'Show Json';
    const stateButton = (
      <Button
        variant={this.state.jsonState ? "secondary" : "info"}
        onClick={this.handleStateClick}
      >State</Button>
    );
    const sMsg = this.state.jsonState ? 'show TestLibrary' : 'show FCS state';

    return (
      <React.Fragment>
        <Row>
          <Col>
            <Form onSubmit={this.handleNameSubmit}>
              <Form.Group as={Row} controlId="formBasicEmail">
                <Form.Label column sm={2}>Form Name</Form.Label>
                <Col sm={4}>
                  {/* <Form.Control type="text" placeholder="form name" value={this.state.formName} onChange={this.handleNameChange}/> */}
                  <Form.Control
                    as="select"
                    custom
                    onChange={this.handleNameChange}
                  >
                    {this.selectOptions()}
                  </Form.Control>
                </Col>
                <Col sm={2}>
                  <Button variant="primary" onClick={this.handleNameSubmit}>Submit</Button>
                </Col>
              </Form.Group>
            </Form>
          </Col>
          <Col sm={4}>
            <TT tip={sMsg}>{stateButton}</TT>
            &nbsp;&nbsp;&nbsp;
            <TT tip={jMsg}>{jsonButton}</TT>
            &nbsp;&nbsp;&nbsp;
            <TT tip={dMsg}>{debugButton}</TT>
          </Col>
        </Row>
        {
          this.state.showJson
            ? this.renderJsonView()
            : this.renderCalcView()
        }
      </React.Fragment>
    );
  }
}

const FormCalcSelector = connect(
  mapStateToProps,
  dispatchProps
)(FormCalcSelectorBase);

export { FormCalcSelector };
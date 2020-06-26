import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { ActionCreators as UndoActionCreators } from 'redux-undo'

import * as actions from '../actions';
import * as selectors from '../selectors';
import { FormCalcView } from './FormCalcView';
import { TestLibrary } from '../models';
import TT from '../../../components/tooltips';

const mapStateToProps = (state: RootState) => ({
  formCalcs: selectors.getFormCalcs(state.formCalc)
});

const dispatchProps = {
  resetState: actions.resetState,
  clearUndoHistory: UndoActionCreators.clearHistory
};

interface FormCalcPageProps {
  fcId: string
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & FormCalcPageProps;
type State = {
  fcId: string,
  debug: boolean,
  showJson: boolean,
  jsonState: boolean
}

class FormCalcPageBase extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      fcId: this.props.fcId,
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

  formCalc() {
    return this.props.formCalcs[this.state.fcId];
  }

  componentDidUpdate(prevProps:Props) {
  }

  componentDidMount() {
    if( !this.formCalc() ) {
      this.resetReduxState();
    }
  }

  resetReduxState() {
    const formCalc = TestLibrary.formCalcs[this.state.fcId];
    if( formCalc ) {
      console.log(`MFormCalc found with name '${this.state.fcId}'`);
      this.props.resetState(this.state.fcId, formCalc.clone());
      this.props.clearUndoHistory();
      return;
    }
    console.log(`No MFormCalc found with name '${this.state.fcId}'`);
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
      fcId: event.target.value
    })
    setTimeout( () => this.handleNameSubmit(event), 0);
  }

  handleNameSubmit(event: any) {
    event.preventDefault();
    const formCalc = TestLibrary.formCalcs[this.state.fcId];
    if( !formCalc ) {
      alert(`Couldn't find model with name: '${this.state.fcId}'`);
      return;
    }
    setTimeout( ()  => this.resetReduxState(), 0);
  }

  selectOptions() {
    const options = Object.values(TestLibrary.formCalcs).map( (formCalc, index) => {
      return (<option key={index} value={formCalc.srvr_id}>{formCalc.name}</option>);
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
      ? this.formCalc().toJsonObject()
      : TestLibrary.formCalcs[this.state.fcId].toJsonObject();
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
          <FormCalcView id={this.state.fcId} debug={this.state.debug}/>
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
                  {/* <Form.Control type="text" placeholder="form name" value={this.state.fcId} onChange={this.handleNameChange}/> */}
                  <Form.Control
                    as="select"
                    custom
                    onChange={this.handleNameChange}
                    defaultValue={this.state.fcId}
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
            {/* <TT tip={sMsg}>{stateButton}</TT> */}
            {/* &nbsp;&nbsp;&nbsp; */}
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

const FormCalcPage = connect(
  mapStateToProps,
  dispatchProps
)(FormCalcPageBase);

export { FormCalcPage };
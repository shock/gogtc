import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { ActionCreators as UndoActionCreators } from 'redux-undo'

import * as actions from '../actions';
import * as selectors from '../selectors';
import { FormCalcView } from './FormCalcView';
import TT from '../../../components/tooltips';

const mapStateToProps = (state: RootState) => ({
  formCalcs: selectors.getFormCalcs(state.formCalc),
  currentId: state.formCalc.present.currentId
});

const dispatchProps = {
  resetState: actions.resetState,
  clearUndoHistory: UndoActionCreators.clearHistory,
  setFcId: actions.setFcId
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
    this.handeSelectChange = this.handeSelectChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
    this.handleDebugClick = this.handleDebugClick.bind(this);
    this.handleJsonClick = this.handleJsonClick.bind(this);
    this.handleStateClick = this.handleStateClick.bind(this);
  }

  formCalc() {
    return this.props.formCalcs[this.state.fcId];
  }

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
      this.resetReduxState();
    }
  }

  resetReduxState() {
    const formCalc = this.props.formCalcs[this.state.fcId];
    if( formCalc ) {
      console.log(`MFormCalc found with id '${this.state.fcId}'`);
      this.props.resetState(this.state.fcId, formCalc.clone());
      this.props.clearUndoHistory();
      return;
    }
    console.log(`No MFormCalc found with id '${this.state.fcId}'`);
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

  handeSelectChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      fcId: event.target.value
    })
    setTimeout( () => this.handleNameSubmit(event), 0);
  }

  handleNameSubmit(event: any) {
    const formCalc = this.props.formCalcs[this.state.fcId];
    if( !formCalc ) {
      alert(`Couldn't find model with id: '${this.state.fcId}'`);
      return;
    }
    setTimeout( ()  => this.resetReduxState(), 0);
    this.props.setFcId(this.state.fcId)
  }

  selectOptions() {
    const options = Object.values(this.props.formCalcs).map( (formCalc, index) => {
      return (<option key={index} value={formCalc.id}>{formCalc.name}</option>);
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
      : this.props.formCalcs[this.state.fcId].toJsonObject();
    if( !obj ) {
      return <h4>Can't find formCalc with id '{this.state.fcId}'</h4>
    }
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

    return (
      <React.Fragment>
        <Row>
          <Col>
            <Form onSubmit={this.handleNameSubmit}>
              <Form.Group as={Row} controlId="formBasicEmail">
                <Form.Label column sm={2}>Load Preset</Form.Label>
                <Col sm={4}>
                  {/* <Form.Control type="text" placeholder="form name" value={this.state.fcId} onChange={this.handeSelectChange}/> */}
                  <Form.Control
                    as="select"
                    custom
                    onChange={this.handeSelectChange}
                    defaultValue={this.state.fcId}
                  >
                    {this.selectOptions()}
                  </Form.Control>
                </Col>
                <Col sm={2}>
                  <Button variant="primary" onClick={this.handleNameSubmit}>OK</Button>
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
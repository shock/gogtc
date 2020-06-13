import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
  debug: boolean
}

class FormCalcSelectorBase extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      formCalc: TestLibrary.formCalcs[this.props.name],
      formName: '',
      debug: false
    }
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
    this.handleDebugClick = this.handleDebugClick.bind(this);
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

  render() {
    const debugButton = (
      <Button
        variant={this.state.debug ? "secondary" : "info"}
        onClick={this.handleDebugClick}
      >Debug</Button>
    );
    const msg = this.state.debug ? 'Hide Debug Info' : 'Show Debug Info';

    return (
      <React.Fragment>
        <Row>
          <Col>
            <Form onSubmit={this.handleNameSubmit}>
              <Form.Group as={Row} controlId="formBasicEmail">
                <Form.Label column sm={2}>Form Name</Form.Label>
                <Col sm={4}>
                  <Form.Control type="text" placeholder="form name" value={this.state.formName} onChange={this.handleNameChange}/>
                </Col>
                <Col sm={2}>
                  <Button variant="primary" onClick={this.handleNameSubmit}>Submit</Button>
                </Col>
              </Form.Group>
            </Form>
          </Col>
          <Col sm={3}>
            <TT tip={msg}>{debugButton}</TT>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormCalcView id={this.state.formCalc.name} debug={this.state.debug}/>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const FormCalcSelector = connect(
  mapStateToProps,
  dispatchProps
)(FormCalcSelectorBase);

export { FormCalcSelector };
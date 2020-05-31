import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';

import { FormCalcView } from './FormCalcView';
import { TestLibrary, MFormCalc } from '../models';

const mapStateToProps = (state: RootState) => ({
});

const dispatchProps = {
};

interface FormCalcSelectorProps {
  name: string
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & FormCalcSelectorProps;
type State = {
  formCalcModel: MFormCalc,
  formName: string
}

class FormCalcSelectorBase extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      formCalcModel: TestLibrary.formCalcs[this.props.name],
      formName: ''
    }
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
  }

  handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      formName: event.target.value
    })
  }

  handleNameSubmit(event: any) {
    event.preventDefault();
    const formCalcModel = TestLibrary.formCalcs[this.state.formName];
    if( !formCalcModel )
      alert(`Couldn't find model with name: '${this.state.formName}'`);
    this.setState({
      formCalcModel: formCalcModel
    })
  }

  render() {
    return (
      <React.Fragment>
        <Form onSubmit={this.handleNameSubmit}>
          <Form.Group as={Row} controlId="formBasicEmail">
            <Form.Label column sm={2}> Form Name</Form.Label>
            <Col sm={4}>
              <Form.Control type="text" placeholder="form name" value={this.state.formName} onChange={this.handleNameChange}/>
            </Col>
            <Col sm={2}>
              <Button variant="primary" onClick={this.handleNameSubmit}>Submit</Button>
            </Col>
          </Form.Group>
        </Form>
        <Row>
          <Col>
            <FormCalcView formCalcModel={this.state.formCalcModel} />
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
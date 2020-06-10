import { RootState } from 'typesafe-actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import ReactJson from 'react-json-view';

import { FormCalcView } from './FormCalcView';
import { TestLibrary, MFormCalc } from '../models';

const mapStateToProps = (state: RootState) => ({
});

const dispatchProps = {
};

interface FormCalcJsonViewProps {
  name: string
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & FormCalcJsonViewProps;
type State = {
  formCalcModel: MFormCalc,
  formName: string
}

class FormCalcJsonViewBase extends React.Component<Props, State> {

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

  syntaxHighlight(json:string) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
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

  render() {
    const json = JSON.stringify(this.state.formCalcModel.asJsonObject(), null, 2);
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
          <Col style={{textAlign: 'left'}}>
            {/* <ReactJson
              src={this.state.formCalcModel.asJsonObject()}
              theme='monokai'
            /> */}
            <pre className="JsonView" dangerouslySetInnerHTML={{ __html: this.syntaxHighlight(json) }} />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const FormCalcJsonView = connect(
  mapStateToProps,
  dispatchProps
)(FormCalcJsonViewBase);

export { FormCalcJsonView };
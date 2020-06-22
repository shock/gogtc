import * as React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Layout } from '../components/layout'
import { LoginPage } from '../features/users/components/LoginPage'

class LoginView extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Row>
          <Col></Col>
          <Col sm={5}>
            <h2>Login</h2>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="I agree to nothing (optional)" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default () =>
<Layout
  title="GOG Troop Calculator"
>
  <LoginPage />
</Layout>

import React, { FunctionComponent } from 'react'; // importing FunctionComponent
import { Link } from "react-router-dom";
import { LayoutProps } from './layout.types';
import { Container, Row, Col, Navbar, Nav, NavDropdown, Form, FormControl,
  Button } from 'react-bootstrap';

const Layout: FunctionComponent<LayoutProps> = ({ title, paragraph, children }) => {
  return (
    <main>
      <Container fluid>
        <Row>
          <Col md={12}>
            <Navbar bg="primary" expand="lg" className="navbar-dark">
              <Navbar.Brand href="#home">Divine</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Link to="/" className='nav-link'>Calc</Link>
                  <Link to="/json" className='nav-link'>Json</Link>
                  <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                <Form inline>
                  <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                  <Button variant="outline-success">Search</Button>
                </Form>
              </Navbar.Collapse>
            </Navbar>
          </Col>
          <Col md={12}>
            <h2>{title}</h2>
            <p>{paragraph}</p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {children}
          </Col>
        </Row>
        <Row>
          <div style={{marginBottom: '10rem'}}></div>
        </Row>
        <Row>
          <Col md={2}>
            <h3>Col1</h3>
            <p>Col md=2</p>
          </Col>
          <Col md={4}>
            <h3>Col2</h3>
            <p>Col md=4</p>
          </Col>
          <Col md={6}>
            <h3>Col3</h3>
            <p>Col md=6</p>
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export { Layout };
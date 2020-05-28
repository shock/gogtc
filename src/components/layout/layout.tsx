import React, { FunctionComponent } from 'react'; // importing FunctionComponent
import { LayoutProps } from './layout.types';
import { Container, Row, Col, Navbar, Nav, NavDropdown, Form, FormControl,
  Button, Jumbotron } from 'react-bootstrap';

const html = false;

const Layout: FunctionComponent<LayoutProps> = ({ title, paragraph, children }) => {
  if(!html) {
    return (
      <main>
        <Container fluid>
          <Row>
            <Col md={12}>
              <Navbar bg="primary" expand="lg" className="navbar-dark">
                <Navbar.Brand href="#home">Voodoo</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#link">Link</Nav.Link>
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
              <Jumbotron>
                <h2>{title}</h2>
                <p>{paragraph}</p>
              </Jumbotron>
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
  } else {
    return (
<div className="container-fluid">
  <div className="row">
    <div className="col-md-12">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
          <span className="navbar-toggler-icon"></span>
        </button> <a className="navbar-brand" href="#">Brand</a>
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">Link <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown">Dropdown link</a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a className="dropdown-item" href="#">Action</a> <a className="dropdown-item" href="#">Another action</a> <a className="dropdown-item" href="#">Something else here</a>
                <div className="dropdown-divider"></div> <a className="dropdown-item" href="#">Separated link</a>
              </div>
            </li>
          </ul>
          <form className="form-inline">
            <input className="form-control mr-sm-2" type="text" />
            <button className="btn btn-primary my-2 my-sm-0" type="submit">
              Search
            </button>
          </form>
          <ul className="navbar-nav ml-md-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Link <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown">Dropdown link</a>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                <a className="dropdown-item" href="#">Action</a> <a className="dropdown-item" href="#">Another action</a> <a className="dropdown-item" href="#">Something else here</a>
                <div className="dropdown-divider">
                </div> <a className="dropdown-item" href="#">Separated link</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <div className="jumbotron">
        <h2>
          Hello, world!
        </h2>
        <p>
          This is a template for a simple marketing or informational website. It includes a large callout called the hero unit and three supporting pieces of content. Use it as a starting point to create something more unique.
        </p>
        <p>
          <a className="btn btn-primary btn-large" href="#">Learn more</a>
        </p>
      </div>
    </div>
    <div className="row">
      <div className="col-md-4">
        <h2>
          Heading
        </h2>
        <p>
          Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
        </p>
        <p>
          <a className="btn" href="#">View details »</a>
        </p>
      </div>
      <div className="col-md-4">
        <h2>
          Heading
        </h2>
        <p>
          Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
        </p>
        <p>
          <a className="btn" href="#">View details »</a>
        </p>
      </div>
      <div className="col-md-4">
        <h2>
          Heading
        </h2>
        <p>
          Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
        </p>
        <p>
          <a className="btn" href="#">View details »</a>
        </p>
      </div>
    </div>
  </div>
</div>
    )
  }
}

export { Layout };
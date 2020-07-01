import React, { ReactNode } from 'react' // importing FunctionComponent
import { connect } from 'react-redux'
import { Link } from "react-router-dom"
import { Container, Row, Col, Navbar, Nav, NavDropdown, Form, FormControl,
  Button } from 'react-bootstrap'
import { RootState } from 'typesafe-actions'
import * as actions from '../features/users/actions'
import * as usersSelector from '../features/users/selectors'
import { GeneralModal, GeneralAlert } from '../features/modals/components'
import { getAsyncBusy } from '../store/root-selectors'

export interface LayoutProps {
  title: string,
  paragraph?: string,
  children: ReactNode
}

const mapState = (state:RootState) => ({
  currentUser: usersSelector.currentUser(state.users),
  asyncBusy: getAsyncBusy(state)
})

const mapDispatch = {
  logoutUser: actions.logoutUser
}

type Props = ReturnType<typeof mapState> & typeof mapDispatch & LayoutProps;

class Layout extends React.Component<Props> {
  constructor(props:Props) {
    super(props)
    this.handleLogout = this.handleLogout.bind(this)
  }

  currentUser() {
    return this.props.currentUser
  }

  handleLogout(event:React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    this.props.logoutUser()
  }

  loginLogout() {
    if( this.currentUser() ) {
      return (
        <Link to="/login" className='nav-link' onClick={this.handleLogout}>Logout</Link>
      )
    } else {
      return (
        <Link to="/login" className='nav-link'>Login</Link>
      )
    }
  }

  render () {
    const displayBusy = this.props.asyncBusy ? 'block' : 'none'
    return (
      <main>
        <div className='async_busy' style={{display: displayBusy}}></div>
        <Container fluid>
          <GeneralAlert/>
          <Row>
            <Col md={12}>
              <Navbar bg="primary" expand="lg" className="navbar-dark">
                <Link to="/" className='navbar-brand'>Divine</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto">
                    <Link to="/" className='nav-link'>Calc</Link>
                    {this.loginLogout()}
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
              <h2>{this.props.title}</h2>
              <p>{this.props.paragraph}</p>
            </Col>
          </Row>
          <GeneralModal/>
          <Row>
            <Col md={12}>
              {this.props.children}
            </Col>
          </Row>
          <Row>
            <div style={{marginBottom: '10rem'}}></div>
          </Row>
        </Container>
      </main>
    )
  }
}

const connectedLayout = connect(mapState, mapDispatch)(Layout);
export { connectedLayout as Layout };
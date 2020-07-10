import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import * as actions from '../actions'
import { RootState } from 'typesafe-actions'

const mapState = (state: RootState) => ({
  registering: state.users.isRegistering
})

const mapDispatch = {
  createUser: actions.createUser,
}

type Props = ReturnType<typeof mapState> & typeof mapDispatch & LoginPageProps
type State = {
  user: {
    name: string,
    email: string,
    password: string
  },
  submitted: boolean
}


interface LoginPageProps {
}

class RegisterPage extends React.Component<Props, State> {
    constructor(props:Props) {
      super(props)

      this.state = {
        user: {
          name: '',
          email: '',
          password: ''
        },
        submitted: false
      }

      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e:React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = e.target
      const { user } = this.state
      switch(name) {
        case 'name' :
          this.setState({user:{ ...user, name: value }})
          break
        case 'email' :
          this.setState({user:{ ...user, email: value }})
          break
        case 'password' :
          this.setState({user:{ ...user, password: value }})
          break
      }
    }

    handleSubmit(e:React.FormEvent<HTMLFormElement>) {
      e.preventDefault()

      this.setState({ submitted: true })
      const { user } = this.state
      if( user.name && user.email && user.password ) {
        this.props.createUser(this.state.user)
      }
    }

    render() {
      const { registering  } = this.props
      const { user, submitted } = this.state
      return (
        <div className="col-md-6 col-md-offset-3">
            <h2>Register</h2>
            <form name="form" onSubmit={this.handleSubmit}>
                <div className={'form-group' + (submitted && !user.name ? ' has-error' : '')}>
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" name="name" value={user.name} onChange={this.handleChange} />
                    {submitted && !user.name &&
                        <div className="help-block">Name is required</div>
                    }
                </div>
                <div className={'form-group' + (submitted && !user.email ? ' has-error' : '')}>
                    <label htmlFor="email">Email</label>
                    <input type="text" className="form-control" name="email" value={user.email} onChange={this.handleChange} />
                    {submitted && !user.email &&
                        <div className="help-block">Email is required</div>
                    }
                </div>
                <div className={'form-group' + (submitted && !user.password ? ' has-error' : '')}>
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" name="password" value={user.password} onChange={this.handleChange} />
                    {submitted && !user.password &&
                        <div className="help-block">Password is required</div>
                    }
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">Register</button>
                    {registering &&
                        <img alt='spinner' src="data:image/gifbase64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                    }
                    <Link to="/login" className="btn btn-link">Cancel</Link>
                </div>
            </form>
        </div>
      )
  }
}

const connectedRegisterPage = connect(mapState, mapDispatch)(RegisterPage)
export { connectedRegisterPage as RegisterPage }
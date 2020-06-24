import React from "react"
import { Switch, Route } from "react-router-dom"
import { ConnectedRouter } from 'connected-react-router'
import PrivateRoute from './components/PrivateRoute'
import Calc from './routes/calc'
import LoginView from './routes/login'
import RegisterView from './routes/register'
import history from './lib/history'

export default function App() {
  return (
    <ConnectedRouter history={history}>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login" component={LoginView} />
          <Route path="/register" component={RegisterView} />
          <PrivateRoute exact path="/" component={Calc} />
        </Switch>
    </ConnectedRouter>
  )
}

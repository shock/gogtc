import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Calc from './routes/calc';
import JsonView from './routes/json';

export default function App() {
  return (
    <Router>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/json">
            <JsonView />
          </Route>
          <Route path="/">
            <Calc />
          </Route>
        </Switch>
    </Router>
  );
}

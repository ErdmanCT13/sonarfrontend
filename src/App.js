import logo from './logo.svg';
import './App.css';
import AppHeader from "./components/AppHeader"
import Account from "./pages/Account"
import ShowFinder from "./pages/ShowFinder"
import Artists from "./pages/Artists"
import Navigation from "./components/Navigation"
import Login from "./pages/Login"
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <AppHeader></AppHeader>

      <Router>
        <Switch>
          <Route exact path="">

          </Route>
        </Switch>
        <Switch>
          <Route exact path="/">
            <Redirect to="/login"></Redirect>
          </Route>
          <Route exact path="/login">
            <Login></Login>
          </Route>
          <Route exact path="/artists">
            <Navigation></Navigation>
            <Artists></Artists>
          </Route>
          <Route exact path="/shows">
            <Navigation></Navigation>
          </Route>
          <Route exact path="/locations">
            <Navigation></Navigation>
            <ShowFinder></ShowFinder>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

import React, { Component } from "react";
import Markets from "./Markets";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import {Container, Divider} from 'semantic-ui-react';
import "./semantic/dist/semantic.min.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div style={{padding: '50px'}}>
        <Markets />
        </div>
      </Router>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { connect } from 'react-redux'

import './App.css';

import ApplicationsContainer from './containers/Applications'
import ServersContainer from './containers/Servers'

import { createServer } from './actions'

class App extends Component {
  render() {
    return (
      <div className="App-Container">
        <div className="App-Sidebar">
          <button onClick={() => this.props.dispatch(createServer())}>Create Server</button>
          <ApplicationsContainer />
        </div>
        <div className="App-Contents">
          <ServersContainer />
        </div>
      </div>
    );
  }
}

export default connect()(App);

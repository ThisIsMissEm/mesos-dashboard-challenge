import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import ApplicationsContainer from './containers/Applications'
import ServersContainer from './containers/Servers'

class App extends Component {
  render() {
    return (
      <div className="App-Container">
        <div className="App-Sidebar">
          <ApplicationsContainer />
        </div>
        <div className="App-Contents">
          <ServersContainer />
        </div>
      </div>
    );
  }
}

export default App;

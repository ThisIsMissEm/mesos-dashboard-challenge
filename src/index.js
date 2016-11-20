import React from 'react';
import ReactDOM from 'react-dom';

import configureStore from './configureStore'
import * as actions from './actions'

import Root from './Root';

const store = configureStore();

// Initialization for servers for our cluster
for (var i = 0; i < 4; i++) {
  store.dispatch(actions.createServer());
}

// Create the initial applications:
[
  ['hadoop', '#fb00a0' ],
  ['rails', '#4332e5' ],
  ['chronos', '#00acf7' ],
  ['storm', '#00e2a2' ],
  ['spark', '#8cd654' ]
].forEach((config) => {
  const [name, color] = config;
  store.dispatch(actions.createApplication(name, color))
})

if (typeof window !== 'undefined') {
  window.store = store;
  window.actions = actions;
}

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
);

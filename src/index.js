import React from 'react';
import ReactDOM from 'react-dom';

import configureStore from './configureStore'
import * as actions from './actions'

import Root from './Root';

let initialState = {};
const hasState = document.location.hash === "#error";
if (hasState) {
  initialState = {"entities":{"servers":{"server:0":{"id":"server:0","status":"running"},"server:1":{"id":"server:1","status":"running"}},"applications":{"application:0":{"id":"application:0","name":"hadoop","color":"#fb00a0"},"application:1":{"id":"application:1","name":"rails","color":"#4332e5"},"application:2":{"id":"application:2","name":"chronos","color":"#00acf7"},"application:3":{"id":"application:3","name":"storm","color":"#00e2a2"},"application:4":{"id":"application:4","name":"spark","color":"#8cd654"}},"instances":{"instance:0":{"id":"instance:0","createdAt":1479615942626,"application":"application:1","server":"server:0","status":"running"},"instance:1":{"id":"instance:1","createdAt":1479615943182,"application":"application:1","server":"server:1","status":"running"},"instance:2":{"id":"instance:2","createdAt":1479615945313,"application":"application:2","server":"server:0","status":"running"}}},"indexes":{"instancesByApplication":{"application:0":[],"application:1":["instance:0","instance:1"],"application:2":["instance:2"],"application:3":[],"application:4":[]},"instancesByServer":{"server:0":["instance:0","instance:2"],"server:1":["instance:1"]},"serverByInstance":{"instance:0":"server:0","instance:1":"server:1","instance:2":"server:0"}},"notifications":[]};
}

const store = configureStore(initialState);

if (!hasState) {
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
}

if (typeof window !== 'undefined') {
  window.store = store;
  window.actions = actions;
}

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
);

import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger';
import thunk from 'redux-thunk'

import ApiMiddleware from './middleware/api';

import rootReducer from './reducers'

function configureStore(preloadedState) {
    const store = createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(thunk, createLogger(), ApiMiddleware)
    );

    return store;
}

export default configureStore;
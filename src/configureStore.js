import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import DevTools from './containers/DevTools';
import ApiMiddleware from './middleware/api';

import rootReducer from './reducers'

function configureStore(preloadedState) {
    const store = createStore(
        rootReducer,
        preloadedState,
        compose(
            applyMiddleware(thunk, ApiMiddleware),
            DevTools.instrument()
        )
    );

    return store;
}

export default configureStore;
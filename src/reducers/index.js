import { combineReducers } from 'redux'
import { newContext } from 'immutability-helper'

const update = newContext();

update.extend('$add', (id, originalList = []) => {
    return originalList.concat([id]);
})

update.extend('$remove', (id, originalList = []) => {
    return originalList.filter((val) => val !== id)
});

// NOTE: In a real-world application, we'd be talking to an API Server via either REST or GraphQL.
// In this coding challenge, we're doing everything in memory, so the shape of our data store (redux)
// is drastically different.
//
// In a real-world application, using a REST API, you'd likely be using entity normalization and
// concepts such as Lists, Maps, and Indexes which effectively provide you with a way to query
// any aspect of your applications data (a list of entities, a map of entities related to another
// entity, and a map of entities keyed by a specific field).
//
// You can read more about my thoughts on this here:
//
//      https://www.dropbox.com/s/w9tba9nyt1o0j6f/DatainIdagioWebApp.pdf?dl=0
//      https://gist.github.com/ThisIsMissEm/38c57b8af3d0ac908a7f09241f45c0ac
//
// Alternatively, if we decided to use GraphQL, we could make use of the ApolloData stack, which
// abstracts this storage logic away from our application in a nice little bundle, but effectively
// works in the same manner.

const removeById = (state, id) => {
    if (!state[id]) {
        return state;
    }

    const newState = Object.assign({}, state);
    delete newState[id];

    return newState;
}

const servers = (state = {}, action = {}) => {
    if (action.type === 'server/created') {
        return Object.assign({}, state, {
            [action.payload.id]: action.payload
        })
    }

    if (action.type === 'server/destroy') {
        return removeById(state, action.id);
    }

    return state
}

const applications = (state = {}, action = {}) => {
    if (action.type === 'application/created') {
        return Object.assign({}, state, {
            [action.payload.id]: action.payload
        })
    }

    return state;
}

const instances = (state = {}, action = {}) => {
    if (action.type === 'instances/created') {
        return Object.assign({}, state, {
            [action.payload.id]: action.payload
        })
    }

    if (action.type === 'instances/destroyed') {
        return removeById(state, action.payload.id);
    }

    return state;
}

const instancesByApplication = (state = {}, action) => {
    if (action.type === 'application/created') {
        return Object.assign({}, state, {
            [action.payload.id]: []
        });
    }

    if (action.type === 'instances/created') {
        return update(state, {
            [action.payload.application]: {
                $add: action.payload.id
            }
        });
    }

    if (action.type === 'instances/destroyed') {
        return update(state, {
            [action.payload.application]: {
                $remove: action.payload.id
            }
        });
    }

    return state;
}

const serverByInstance = (state = {}, action) => {
    if (action.type === 'instances/created') {
        return Object.assign({}, state, {
            [action.payload.id]: action.payload.server
        });
    }

    if (action.type === 'instances/destroyed') {
        return removeById(state, action.payload.id);
    }

    return state;
}

const instancesByServer = (state = {}, action) => {
    if (action.type === 'server/created') {
        return Object.assign({}, state, {
            [action.payload.id]: []
        });
    }

    if (action.type === 'instances/created') {
        return update(state, {
            [action.payload.server]: {
                $add: action.payload.id
            }
        });
    }

    if (action.type === 'instances/destroyed') {
        return update(state, {
            [action.payload.server]: {
                $remove: action.payload.id
            }
        });
    }

    return state;
}

export default combineReducers({
    servers,
    applications,
    instances,
    instancesByApplication,
    instancesByServer,
    serverByInstance
});
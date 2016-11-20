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

const createableEntity = (name, fallback) => {
    const created = `${name}/created`;
    const destroyed = `${name}/destroyed`;

    return (state = {}, action) => {
        if (action.type === created) {
            return Object.assign({}, state, {
                [action.payload.id]: action.payload
            })
        }

        if (action.type === destroyed) {
            return removeById(state, action.payload.id);
        }

        if (fallback && action.type && action.type.indexOf(name) === 0) {
            const result = fallback(state, action);
            if (result) {
                return result;
            }
        }

        return state;
    };
}

const createMapIndex = (actions) => {
    const { create, destroy, add, remove } = actions;

    return (state = {}, action) => {
        if (action.type === create.type) {
            return Object.assign({}, state, {
                [action.payload[create.key]]: []
            });
        }

        if (action.type === destroy.type) {
            return removeById(state, action.payload[destroy.key]);
        }

        if (action.type === add.type) {
            return update(state, {
                [action.payload[add.key]]: {
                    $add: action.payload[add.value]
                }
            });
        }

        if (action.type === remove.type) {
            return update(state, {
                [action.payload[remove.key]]: {
                    $remove: action.payload[remove.value]
                }
            });
        }

        return state;
    }
}

const servers = createableEntity('server');
const applications = createableEntity('application');
const instances = createableEntity('instances', (state, action) => {
    if (action.type === 'instances/update-status') {
        return update(state, {
            [action.payload.id]: {
                status: { $set: action.payload.status }
            }
        });
    }

    return state;
});

const instancesByApplication = createMapIndex({
    create: {
        type: 'application/created',
        key: 'id'
    },
    destroy: {
        type: 'application/destroyed',
        key: 'id'
    },
    add: {
        type: 'instances/created',
        key: 'application',
        value: 'id'
    },
    remove: {
        type: 'instances/destroyed',
        key: 'application',
        value: 'id'
    }
});


const instancesByServer = createMapIndex({
    create: {
        type: 'server/created',
        key: 'id'
    },
    destroy: {
        type: 'server/destroyed',
        key: 'id'
    },
    add: {
        type: 'instances/created',
        key: 'server',
        value: 'id'
    },
    remove: {
        type: 'instances/destroyed',
        key: 'server',
        value: 'id'
    }
});

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

const notifications = (state = [], action) => {
    if (action.type === 'notification/created') {
        return state.concat([action.payload]);
    }

    if (action.type === 'notification/destroyed') {
        return state.filter((notification) => notification.id !== action.payload.id);
    }

    return state;
}

export default combineReducers({
    entities: combineReducers({
        servers,
        applications,
        instances
    }),
    indexes: combineReducers({
        instancesByApplication,
        instancesByServer,
        serverByInstance
    }),
    notifications
});
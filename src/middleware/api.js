import generateId from '../generateId';

export const REQUEST = Symbol('Request');

const MAX_INSTANCES = 2;

const findAvailableSlots = (servers, instancesByServer) => {
    return servers.sort((serverOne, serverTwo) => {
        const instancesOnOne = instancesByServer[serverOne].length;
        const instancesOnTwo = instancesByServer[serverTwo].length;

        if (instancesOnOne < instancesOnTwo) {
            return -1;
        }

        if (instancesOnOne > instancesOnTwo) {
            return 1;
        }

        return 0;
    }).reduce((slots, id) => {
        let available = MAX_INSTANCES - instancesByServer[id].length;

        while(available-- > 0) {
            slots.push(id);
        }

        return slots;
    }, []);
}

const startInstance = (store, application, server) => {
    const instanceId = generateId('instance');

    setTimeout(() => store.dispatch({
        type: 'instances/update-status',
        payload: {
            id: instanceId,
            status: 'running'
        }
    }), 1000)

    store.dispatch({
        type: 'instances/created',
        payload: {
            id: instanceId,
            createdAt: Date.now(),
            application: application,
            server: server,
            status: 'starting'
        }
    })
};

const destroyInstance = (store, instance) => {
    const { id, application, server } = instance;

    store.dispatch({
        type: 'instances/update-status',
        payload: {
            id,
            status: 'stopping'
        }
    })

    setTimeout(() => store.dispatch({
        type: 'instances/destroyed',
        payload: {
            id,
            application,
            server
        }
    }), 1500)
}

const HANDLERS = {
    'application/create': function(request, store) {
        store.dispatch({
            type: 'application/created',
            payload: {
                id: generateId('application'),
                name: request.payload.name,
                color: request.payload.color
            }
        });
    },
    'server/create': function(request, store) {
        store.dispatch({
            type: 'server/created',
            payload: {
                id: generateId('server'),
                status: 'running'
            }
        });
    },
    'server/destroy': function(request, store) {
        const serverId = request.payload.id;
        const state = store.getState();

        const instancesToMove = state.indexes.instancesByServer[serverId];

        if (instancesToMove.length > 0) {
            const availableServers = Object.keys(state.entities.servers).filter((id) => id !== serverId);
            const availableSlots = findAvailableSlots(availableServers, state.indexes.instancesByServer);

            instancesToMove.forEach((id) => {
                const instance = state.entities.instances[id];

                store.dispatch({
                    type: 'instances/destroyed',
                    payload: instance
                });

                if (availableSlots.length === 0) {
                    store.dispatch({
                        type: 'notification/created',
                        payload: {
                            id: generateId('notification'),
                            message: `Instance ${instance.id} could not be restarted, not enough available servers`
                        }
                    });

                    return;
                }

                startInstance(store, instance.application, availableSlots.shift());
            });
        }

        store.dispatch({
            type: 'server/destroyed',
            payload: {
                id: serverId
            }
        });
    },
    'application/instances/create': function(request, store) {
        const applicationId = request.payload.application;
        const state = store.getState();

        const availableServers = Object.keys(state.entities.servers);
        const availableSlots = findAvailableSlots(availableServers, state.indexes.instancesByServer);

        if (availableSlots.length === 0) {
            store.dispatch({
                type: 'notification/created',
                payload: {
                    id: generateId('notification'),
                    message: `Could not start instance of ${state.entities.applications[applicationId].name}`
                }
            });

            return;
        }

        const serverId = availableSlots[0];

        startInstance(store, applicationId, serverId)
    },
    'application/instances/destroy': function(request, store) {
        const applicationId = request.payload.application;

        const state = store.getState();

        let instances = state.indexes.instancesByApplication[applicationId];
        if (instances.length === 0) {
            return;
        }

        instances = instances.filter((instance) => {
            return state.entities.instances[instance].status === 'running';
        });

        if (instances.length === 0) {
            return;
        }

        const instanceId = instances[instances.length - 1];

        const instance = state.entities.instances[instanceId];

        destroyInstance(store, instance);
    }
}

const Middleware = (store) => (next) => (action) => {
    const request = action[REQUEST];
    const handler = HANDLERS[action.type];

    if (typeof request === 'undefined' || typeof handler === 'undefined') {
        return next(action);
    }

    try {
        handler(request, store);
    } catch(e) {
        debugger;
        throw e;
    }
}

export default Middleware;
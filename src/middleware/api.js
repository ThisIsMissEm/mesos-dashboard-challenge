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

const HANDLERS = {
    'application/create': function(request) {
        return {
            id: generateId('application'),
            name: request.payload.name
        }
    },
    'server/create': function(request) {
        return {
            id: generateId('server'),
            status: 'running'
        }
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

                store.dispatch({
                    type: 'instances/created',
                    payload: {
                        id: generateId('instance'),
                        createdAt: Date.now(),
                        server: availableSlots.shift(),
                        application: instance.application
                    }
                });
            });
        }

        return {
            id: serverId
        }
    },
    'instances/create': function(request, store) {
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

        return {
            id: generateId('instance'),
            createdAt: Date.now(),
            application: applicationId,
            server: availableSlots[0]
        }
    }
}

const Middleware = (store) => (next) => (action) => {
    const request = action[REQUEST];
    const handler = HANDLERS[action.type];

    if (typeof request === 'undefined' || typeof handler === 'undefined') {
        return next(action);
    }

    const result = handler(request, store);

    if (result) {
        store.dispatch({
            type: request.response,
            payload: result
        });
    }
}

export default Middleware;
import { findKey } from 'lodash'

import generateId from '../generateId';

const MAX_INSTANCES = 2;

export const createServer = () => {
    return {
        type: "server/created",
        payload: {
            id: generateId('server'),
            status: 'running'
        }
    }
}

export const destroyServer = (id) => {
    return {
        type: "server/destroy",
        id
    }
}

export const createApplication = (name) => {
    return {
        type: 'application/created',
        payload: {
            id: generateId('application'),
            name: name
        }
    }
};

export const addInstance = (server, application) => {
    return {
        type: 'instances/created',
        payload: {
            id: generateId('instance'),
            createdAt: Date.now(),
            server,
            application
        }
    }
};

export const removeInstance = (id, server, application) => {
    return {
        type: 'instances/destroyed',
        payload: {
            id,
            server,
            application
        }
    };
};

export const addInstanceOfApplication = (applicationId) => (dispatch, getState) => {
    const state = getState();

    const servers = Object.keys(state.servers);
    const instanceCountsByServer = servers.reduce((acc, server) => {
        acc[server] = state.instancesByServer[server].length
        return acc;
    }, {});

    let server = servers.find((server) => instanceCountsByServer[server] === 0);
    if (!server) {
        server = servers.find((server) => instanceCountsByServer[server] === 1);
    }

    if (!server) {
        return;
    }

    dispatch(addInstance(server, applicationId))
}

export const destroyInstanceOfApplication = (applicationId) => (dispatch, getState) => {
    const state = getState();
    const instances = state.instancesByApplication[applicationId];

    if (instances.length === 0) {
        return;
    }

    const instanceId = instances[instances.length - 1];
    const serverId = state.serverByInstance[instanceId];

    dispatch(removeInstance(instanceId, serverId, applicationId))
}
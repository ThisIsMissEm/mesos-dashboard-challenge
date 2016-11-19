import generateId from '../generateId';

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

const createInstanceOfApplication = (applicationId, state, dispatch) => {
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

export const addInstanceOfApplication = (application) => (dispatch, getState) => {
    createInstanceOfApplication(application, getState(), dispatch);
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

export const createServer = () => {
    return {
        type: "server/created",
        payload: {
            id: generateId('server'),
            status: 'running'
        }
    }
}

export const destroyServer = (id) => (dispatch, getState) => {
    const state = getState();
    const instances = state.instancesByServer[id];

    // Application => Count
    const moved = instances.reduce((acc, instance) => {
        const application = state.instances[instance].application;

        if (!acc[application]) {
            acc[application] = 1;
        } else {
            acc[application]++;
        }

        dispatch(removeInstance(instance, id, application));

        return acc;
    }, {});

    dispatch({
        type: "server/destroy",
        id
    });

    Object.keys(moved).forEach((application) => {
        for (var i = 0; i < moved[application]; i++) {
            createInstanceOfApplication(application, getState(), dispatch);
        }
    });
}
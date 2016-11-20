import generateId from '../generateId';
import { REQUEST } from '../middleware/api';

export const createNotification = (message) => {
    return {
        type: 'notification/created',
        payload: {
            id: generateId('notification'),
            message: message
        }
    }
}

export const destroyNotification = (id) => {
    return {
        type: 'notification/destroyed',
        payload: {
            id
        }
    }
}

export const createTemporalNotification = (message) => (dispatch) => {
    const notification = createNotification(message);

    setTimeout(() => {
        dispatch(destroyNotification(notification.payload.id));
    }, 5000)

    dispatch(notification);
}

export const createApplication = (name) => {
    return {
        type: 'application/create',
        [REQUEST]: {
            response: 'application/created',
            payload: {
                name
            }
        }
    }
}

export const destroyApplication = (id) => {
    return {
        type: 'application/destroy',
        [REQUEST]: {
            response: 'application/destroyed',
            payload: {
                id
            }
        }
    }
}


export const createInstance = (application) => {
    return {
        type: 'application/instances/create',
        [REQUEST]: {
            response: 'instances/created',
            payload: {
                application
            }
        }
    }
}

export const destroyInstance = (application) => {
    return {
        type: 'application/instances/destroy',
        [REQUEST]: {
            response: 'instances/destroyed',
            payload: {
                application
            }
        }
    }
}

export const createServer = () => {
    return {
        type: 'server/create',
        [REQUEST]: {
            response: 'server/created'
        }
    }
}

export const destroyServer = (id) => {
    return {
        type: 'server/destroy',
        [REQUEST]: {
            response: 'server/destroyed',
            payload: {
                id
            }
        }
    }
}
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

export const createApplication = (name, color) => {
    return {
        type: 'application/create',
        [REQUEST]: {
            payload: {
                name,
                color
            }
        }
    }
}

export const destroyApplication = (id) => {
    return {
        type: 'application/destroy',
        [REQUEST]: {
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
            payload: {
                application
            }
        }
    }
}

export const createServer = () => {
    return {
        type: 'server/create',
        [REQUEST]: {}
    }
}

export const destroyServer = (id) => {
    return {
        type: 'server/destroy',
        [REQUEST]: {
            payload: {
                id
            }
        }
    }
}
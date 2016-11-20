import base64url from 'base64url'

const counters = {};

// const generateId = (type) => base64url.encode(`${type}:${++nextId}`);

const generateId = (type) => {
    if (!counters[type]) {
        counters[type] = 0;
    }

    const id = counters[type]++;

    return `${type}:${id}`;
}

export default generateId;
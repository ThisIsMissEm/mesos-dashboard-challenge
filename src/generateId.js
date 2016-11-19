import base64url from 'base64url'

let nextId = 0;

const generateId = (type) => base64url.encode(`${type}:${++nextId}`);

export default generateId;
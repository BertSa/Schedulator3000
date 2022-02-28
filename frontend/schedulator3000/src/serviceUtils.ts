export enum METHODS {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export const requestInit = (method: METHODS, body?: any | string, isString?: boolean) => {
    let value : RequestInit = {
        method: method,
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    if (body && (method === METHODS.POST || method === METHODS.PUT)) {
        value.body = isString ? body : JSON.stringify(body);
    }
    return value;
};

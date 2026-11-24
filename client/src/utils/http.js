const HTTP_METHOD = {
    get: 'GET',
    put: 'PUT',
    post: 'POST',
    delete: 'DELETE'
};

async function request(url, method, body){
    const init = {
        method: method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }

    if(method === HTTP_METHOD.get || !body)
        delete init.body;

    const response = await fetch(`/api${url}`, init);

    const data = await response.json();

    if(!response.ok)
        throw data.message;

    return data;
}

export const httpRequest = {
    async get(url){ return request(url, HTTP_METHOD.get, null); },
    async post(url, body){ return request(url, HTTP_METHOD.post, body); },
    async put(url, body){ return request(url, HTTP_METHOD.put, body); },
    async delete(url, body){ return request(url, HTTP_METHOD.delete, body); },
}
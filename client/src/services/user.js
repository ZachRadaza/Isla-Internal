const USER_ENDPOINT = `/api/users`;

export async function loginUser({ email, password }){
    const response = await fetch(`${USER_ENDPOINT}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if(!response.ok)
        throw new Error(data.message);

    return getCurrentUser();
}

export async function registerUser(){
    const response = await fetch(`${USER_ENDPOINT}/register`);

}

export async function logoutUser(){
    const response = await fetch(`${USER_ENDPOINT}/logout`);

}

export async function getCurrentUser(){
    const response = await fetch(`${USER_ENDPOINT}/mirror`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if(!response.ok)
        throw new Error(data.message);

    return data;
}
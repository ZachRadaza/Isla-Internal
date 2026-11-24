import { httpRequest } from "../utils/http";

const USER_ENDPOINT = `/users`;

export async function loginUser({ email, password }){
    await httpRequest.post(`${USER_ENDPOINT}/login`, { email, password });

    return getCurrentUser();
}

export async function registerUser({ email, password, firstName, lastName }){
    await httpRequest.post(`${USER_ENDPOINT}/register`, { email, password, firstName, lastName });

    return getCurrentUser();
}

export async function logoutUser(){
    const data = await httpRequest.post(
        `${USER_ENDPOINT}/logout`,
        null
    );

    return data;
}

export async function getCurrentUser(){
    const data = await httpRequest.get(`${USER_ENDPOINT}/mirror`);

    return data;
}
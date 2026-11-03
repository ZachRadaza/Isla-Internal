import { getAuthDb } from "../db/mongo.js";

const USERS_COLLECTION = 'users';

export async function getUsers(){
    return await getAuthDb()
        .collection(USERS_COLLECTION)
        .find({})
        .toArray();
}

export async function getUser(userId){
    return await getAuthDb()
        .collection(USERS_COLLECTION)
        .findOne({ _id: userId });
}

export async function addUser(user = { email, passwordHash, firstName, lastName, role }){
    return await getAuthDb()
        .collection(USERS_COLLECTION)
        .insertOne(user);
}
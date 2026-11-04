import { ObjectId } from "mongodb";
import { getMongoDb } from "../db/mongo.js";

const USERS_COLLECTION = 'users';

export async function getAllUsers(){
    return getMongoDb()
        .collection(USERS_COLLECTION)
        .find({ projection: { passwordHash: 0 } })
        .toArray();
}

export async function getUserById(userId){
    return getMongoDb()
        .collection(USERS_COLLECTION)
        .findOne(
            { _id: new ObjectId(userId) },
            { projection: { passwordHash: 0 } }
        );
}

export async function getUserByEmail(email){
    return getMongoDb()
        .collection(USERS_COLLECTION)
        .findOne({ email });
}

export async function insertUser(user = { email, passwordHash, firstName, lastName, role, createdAt, updatedAt }){
    return getMongoDb()
        .collection(USERS_COLLECTION)
        .insertOne(user);
}

export async function checkExistingUser(email){
    const user = await getUserByEmail(email);

    return !!user;
}
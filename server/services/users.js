import { ObjectId } from "mongodb";
import { getMongoDb } from "../db/mongo.js";

const USERS_COLLECTION = 'users';

export async function getUsers(){
    return getMongoDb()
        .collection(USERS_COLLECTION)
        .find({})
        .toArray();
}

export async function getUser(userId){
    return getMongoDb()
        .collection(USERS_COLLECTION)
        .findOne({
            _id: new ObjectId(userId)
        });
}

export async function addUser(user = { email, passwordHash, firstName, lastName, role }){
    return getMongoDb()
        .collection(USERS_COLLECTION)
        .insertOne(user);
}
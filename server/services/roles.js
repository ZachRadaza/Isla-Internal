import { ObjectId } from "mongodb";
import { getMongoDb } from "../db/mongo.js";

const ROLES_COLLECTION = 'roles';

export async function getAllRoles(){
    return getMongoDb()
        .collection(ROLES_COLLECTION)
        .find({})
        .toArray();
}

export async function getRole(roleId){
    return getMongoDb()
        .collection(ROLES_COLLECTION)
        .findOne({ _id: new ObjectId(roleId)});
}

export async function getRoles(roleIds){
    return getMongoDb()
        .collection(ROLES_COLLECTION)
        .find({ _id: { $in: roleIds }})
        .toArray();
}

export async function getOwnerRoleId(){
    const ownerRole = await getMongoDb()
        .collection(ROLES_COLLECTION)
        .findOne({ name: 'owner'});

    return ownerRole._id;
}

export async function getDefaultRoleId(){
    const role = await getMongoDb()
        .collection(ROLES_COLLECTION)
        .findOne({ name: 'cleaner'});

    return role._id;
}
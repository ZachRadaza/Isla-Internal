import { ObjectId } from "mongodb";
import { getMongoDb } from "../db/mongo.js";

const BUSINESS_COLLECTION = 'business';
const BUSINESS_MEMBERS_COLLECTION = 'business_members';

export async function getAllBusiness(){
    return getMongoDb()
        .collection(BUSINESS_COLLECTION)
        .find({})
        .toArray();
}

export async function getBusiness(businessId){
    return getMongoDb()
        .collection(BUSINESS_COLLECTION)
        .findOne({ _id: new ObjectId(businessId) });
}

export async function checkExistingBusinessByName(name){
    const business = await getMongoDb()
        .collection(BUSINESS_COLLECTION)
        .findOne({ name });

    return !!business
}

export async function checkExistingBusinessById(businessId){
    const business = await getMongoDb()
        .collection(BUSINESS_COLLECTION)
        .findOne({ _id: new ObjectId(businessId) });

    return !!business;
}

export async function insertBusiness({ name, createdById, createdAt, updatedAt }){
    return getMongoDb()
        .collection(BUSINESS_COLLECTION)
        .insertOne({ name, createdById: new ObjectId(createdById), createdAt, updatedAt });
}

export async function updateBusiness({ updates, businessId }){
    return getMongoDb()
        .collection(BUSINESS_COLLECTION)
        .updateOne(
            { _id: new ObjectId(businessId) },
            {
                $set: {
                    ...updates,
                    updatedAt: new Date()
                }
            }
        );
}

export async function removeBusiness(businessId){
    return getMongoDb()
        .collection(BUSINESS_COLLECTION)
        .deleteOne({ _id: new ObjectId(businessId)});
}

export async function addUserToBusiness({ userId, businessId, role, createdAt, updatedAt }){
    return getMongoDb()
        .collection(BUSINESS_MEMBERS_COLLECTION)
        .insertOne({ 
            userId: new ObjectId(userId), 
            businessId: new ObjectId(businessId), 
            role, 
            createdAt, 
            updatedAt 
        });
}

export async function removeUserFromBusiness({ businessId, userId }){
    return getMongoDb()
        .collection(BUSINESS_MEMBERS_COLLECTION)
        .deleteOne({ 
            userId: new ObjectId(userId), 
            businessId: new ObjectId(businessId) 
        });
}

export async function checkExistingMember({ businessId, userId }){
    const member = await getMongoDb()
        .collection(BUSINESS_MEMBERS_COLLECTION)
        .findOne({ userId: new ObjectId(userId), businessId: new ObjectId(businessId) });

    return !!member;
}

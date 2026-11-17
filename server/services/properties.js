import { ObjectId } from "mongodb";
import { getMongoDb } from "../db/mongo.js";


const PROPERTIES_COLLECTION = 'properties';

export async function getProperty(propertyId){
    return getMongoDb()
        .collection(PROPERTIES_COLLECTION)
        .findOne(
            { _id: new ObjectId(propertyId), deleted: { $ne: true } },
            { projection: { deleted: 0 }}
        );
}

export async function getBusinessProperties(businessId){
    return getMongoDb()
        .collection(PROPERTIES_COLLECTION)
        .find(
            { businessId: new ObjectId(businessId), deleted: { $ne: true } },
            { projection: { deleted: 0 }}
        )
        .toArray();
}

export async function checkExistingPropertyName(businessId, name){
    const property = await getMongoDb()
        .collection(PROPERTIES_COLLECTION)
        .find({ businessId: new ObjectId(businessId), name, deleted: { $ne: true } });

    return !!property;
}

export async function addProperty({ businessId, name, address, createdAt, updatedAt }){
    return getMongoDb()
        .collection(PROPERTIES_COLLECTION)
        .insertOne({
            name,
            address,
            businessId: new ObjectId(businessId),
            createdAt,
            updatedAt,
            deleted: false
        });
}

export async function updateProperty({ updates, propertyId }){
    return getMongoDb()
        .collection(PROPERTIES_COLLECTION)
        .updateOne(
            { _id: new ObjectId(propertyId) },
            {
                $set: {
                    ...updates,
                    updatedAt: new Date()
                }
            }
        );
}

export async function deleteProperty(propertyId){
    return getMongoDb()
        .collection(PROPERTIES_COLLECTION)
        .updateOne(
            { _id: new ObjectId(propertyId) },
            {
                $set: {
                    deleted: true,
                    updatedAt: new Date()
                }
            }
        );
}
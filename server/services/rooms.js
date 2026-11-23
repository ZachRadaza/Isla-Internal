import { ObjectId } from "mongodb";
import { getMongoDb } from "../db/mongo.js";

const ROOM_COLLECTION = 'rooms';

export async function getRoom(roomId){
    return getMongoDb()
        .collection(ROOM_COLLECTION)
        .findOne(
            { _id: new ObjectId(roomId), deleted: { $ne: true } },
            { projection: { deleted: 0 }}
        );
}

export async function getPropertyRooms(propertyId){
    return getMongoDb()
        .collection(ROOM_COLLECTION)
        .find(
            { propertyId: new ObjectId(propertyId), deleted: { $ne: true } },
            { projection: { deleted: 0 }}
        )
        .toArray();
}

export async function insertRoom({ propertyId, name, checklist }){
    return getMongoDb()
        .collection(ROOM_COLLECTION)
        .insertOne({
            propertyId: new ObjectId(propertyId),
            name,
            checklist,
            createdAt: new Date(),
            updatedAt: null,
            deleted: false
        });
}

export async function insertRooms(rooms, propertyId){
    return getMongoDb()
        .collection(ROOM_COLLECTION)
        .bulkWrite(
            rooms.map(({ name, checklist }) => ({
                insertOne: {
                    document: {
                        propertyId: new ObjectId(propertyId),
                        name,
                        checklist,
                        createdAt: new Date(),
                        updatedAt: null,
                        deleted: false
                    }
                }
            }))
        );
}

export async function updateRoom({ roomId, updates }){
    return getMongoDb()
        .collection(ROOM_COLLECTION)
        .updateOne(
            { _id: new ObjectId(roomId)},
            { $set: { ...updates, updatedAt: new Date()} }
        )
}

export async function updateRooms(rooms){
    return getMongoDb()
        .collection(ROOM_COLLECTION)
        .bulkWrite(
            rooms.map(({ _id, ...updates }) => ({
                updateOne: {
                    filter: { _id: new ObjectId(_id) },
                    update: { $set: { ...updates, updatedAt: new Date() } }
                }
            }))
        );
}

export async function deleteRoom(roomId){
    return getMongoDb()
        .collection(ROOM_COLLECTION)
        .updateOne(
            { _id: new ObjectId(roomId)},
            { $set: { deleted: true } }
        );
}

export async function deleteRooms(roomIds){
    return getMongoDb()
        .collection(ROOM_COLLECTION)
        .updateMany(
            { _id: { $in: roomIds.map((id) => new ObjectId(id) )}},
            { $set: { deleted: true }}
        );
}

export async function deleteAllPropertyRooms(propertyId){
    return getMongoDb()
        .collection(ROOM_COLLECTION)
        .updateMany(
            { propertyId: new ObjectId(propertyId) },
            { $set: { deleted: true }}
        );
}
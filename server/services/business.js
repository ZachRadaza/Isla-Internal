import { ObjectId } from "mongodb";
import { getMongoDb } from "../db/mongo.js";
import { getRole, getRoles } from "./roles.js";

const BUSINESS_COLLECTION = 'business';
const BUSINESS_MEMBERS_COLLECTION = 'business_members';
const VERIFIED_EMAILS_COLLECTION = 'business_verified_emails';
const QA_BUSINESS_NAME = process.env.QA_BUSINESS_NAME;

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

export async function getBusinesses(businessIds){
    return getMongoDb()
        .collection(BUSINESS_COLLECTION)
        .find({
            _id: { $in: businessIds }
        })
        .toArray();
}

export async function getQABusinessId(){
    return getMongoDb()
        .collection(BUSINESS_COLLECTION)
        .findOne(
            { name: QA_BUSINESS_NAME },
            { projection: { name: 0, createdAt: 0, updatedAt: 0, createdById: 0 } }
        );
}

export async function insertBusiness({ name, createdById, createdAt, updatedAt }){
    return getMongoDb()
        .collection(BUSINESS_COLLECTION)
        .insertOne({ name, createdById: new ObjectId(createdById), createdAt, updatedAt });
}

export async function updateBusiness({ name, businessId }){
    return getMongoDb()
        .collection(BUSINESS_COLLECTION)
        .updateOne(
            { _id: new ObjectId(businessId) },
            {
                $set: {
                    name,
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

export async function addUserToBusiness({ userId, businessId, roleId, createdAt, updatedAt }){
    return getMongoDb()
        .collection(BUSINESS_MEMBERS_COLLECTION)
        .insertOne({ 
            userId: new ObjectId(userId), 
            businessId: new ObjectId(businessId), 
            roleId, 
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

export async function getBusinessMember({ businessId, userId }){
    const member = await getMongoDb()
        .collection(BUSINESS_MEMBERS_COLLECTION)
        .findOne({ userId: new ObjectId(userId), businessId: new ObjectId(businessId) });

    const role = await getRole(member.roleId);
    return {
        _id: member._id,
        role: role.name,
        permissions: role.permissions,
        ...member,
    };
}

export async function getUsersBusiness(userId){
    const members = await getMongoDb()
        .collection(BUSINESS_MEMBERS_COLLECTION)
        .find({
            userId: new ObjectId(userId)
        })
        .toArray();

    const businessIds = members.map((member) => member.businessId);
    const roleIds = members.map((member) => member.roleId);

    const [businesses, roles] = await Promise.all([
        getBusinesses(businessIds),
        getRoles(roleIds)
    ]);

    const roleMapped = new Map(
        roles.map(role => [
            role._id.toString(),
            role.name
        ])
    );

    const roleByBusinessId = new Map(
        members.map(member => [
            member.businessId.toString(),
            roleMapped.get(member.roleId.toString())
        ])
    );

    return businesses.map(business => ({
        ...business,
        role: roleByBusinessId.get(business._id.toString())
    }));
}

export async function getVerifiedEmails(businessId){
    return getMongoDb()
        .collection(VERIFIED_EMAILS_COLLECTION)
        .find(
            { businessId: new ObjectId(businessId), used: { $ne: true } },
            { projection: { used: 0 }}
        )
        .toArray();
}

export async function updateVerifiedEmails({ emails, businessId }){
    if(!emails)
        return;

    return getMongoDb()
        .collection(VERIFIED_EMAILS_COLLECTION)
        .bulkWrite(
            emails.map(({ _id, createdAt, updatedAt, used, businessId: incomingBusinessId, ...updates }) => {
                const id = _id ? new ObjectId(_id) : new ObjectId();

                return {
                    updateOne: {
                        filter: { _id: id },
                        update: { 
                            $set: { 
                                ...updates, 
                                updatedAt: new Date() 
                            },
                            $setOnInsert: {
                                createdAt: new Date(),
                                used: false,
                                businessId: new ObjectId(businessId),
                            } 
                        },
                        upsert: true
                    }
                }
            })
        );
}

export async function usedVerifiedEmail({ businessId, email }){
    return getMongoDb()
        .collection(VERIFIED_EMAILS_COLLECTION)
        .updateOne(
            { businessId: new ObjectId(businessId), email},
            { $set: { used: true}}
        );
}

export async function deleteVerifiedEmails({ businessId, emails }){
    if(!emails)
        return;

    return getMongoDb()
        .collection(VERIFIED_EMAILS_COLLECTION)
        .bulkWrite(
            emails.map(({ email }) => ({
                deleteOne: { filter: { businessId: new ObjectId(businessId), email }}
            }))
        );
}
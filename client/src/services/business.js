import { httpRequest } from "../utils/http";

const BUSINESS_ENDPOINT = '/business';

export async function getUserBusinesses(userId){
    return httpRequest.get(`${BUSINESS_ENDPOINT}/memberof/${userId}`);
}

export async function getBusinessMember(businessId){
    return httpRequest.get(`${BUSINESS_ENDPOINT}/memberinfo/${businessId}`);
}

export async function getQABusinessId(){
    return httpRequest.get(`${BUSINESS_ENDPOINT}/qabusiness/`);
}

export async function getVerifiedEmails(businessId){
    return httpRequest.get(`${BUSINESS_ENDPOINT}/verifiedemails/${businessId}`);
}

export async function updateVerifiedEmails(businessId, { deletedEmails, emails }){
    return httpRequest.put(`${BUSINESS_ENDPOINT}/verifiedemails/${businessId}`, { deletedEmails, emails });
}
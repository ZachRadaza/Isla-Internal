import { httpRequest } from "../utils/http";

const BUSINESS_ENDPOINT = '/business';

export async function getUserBusinesses(userId){
    return httpRequest.get(`${BUSINESS_ENDPOINT}/memberof/${userId}`);
}
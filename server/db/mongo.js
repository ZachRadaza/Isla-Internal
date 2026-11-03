import { MongoClient } from 'mongodb';

const DB_WALKTHROUGH = 'walkthroughs';
const DB_AUTH = 'auth';

const client = new MongoClient(process.env.MONGO_URI);
let walkthroughsDb;
let authDb;

export async function connectToMongoDB(){
    try {
        await client.connect();

        walkthroughsDb = client.db(DB_WALKTHROUGH);
        console.log("connected to walkthrough db");

        authDb = client.db(DB_AUTH);
        console.log("connected to auth db");

        console.log("all dbs connected");
    } catch (err) {
        console.error('mongodb connection failed', err);
        throw err;
    }
}

export async function disconnectFromMongoDB() {
    await client.close();
}

export const getWalkthroughsDb = () => requireDb(walkthroughsDb);
export const getAuthDb = () => requireDb(authDb);


function requireDb(db){
    if(!db)
        throw new Error('db no connected');

    return db
}
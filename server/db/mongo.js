import { MongoClient } from 'mongodb';

const DB_MODE = Object.freeze({
    'DEV': 'development_db',
    'QA': 'qa_db',
    'PROD': 'prod_db'
});

const client = new MongoClient(process.env.MONGO_URI);
const mode = process.env.MODE;

let mongoDb;

export async function connectToMongoDB(){
    try {
        await client.connect();

        mongoDb = client.db(DB_MODE[mode]);
        console.log(`connected to ${mode} db`);
    } catch (err) {
        console.error('mongodb connection failed', err);
        throw err;
    }
}

export async function disconnectFromMongoDB() {
    await client.close();
}

export const getMongoDb = () => requireDb(mongoDb);

function requireDb(db){
    if(!db)
        throw new Error('db no connected');

    return db
}
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.NEXT_ONLINE_STORE_DB_URL!);

const clientPromise = client.connect();

export const getDB = async () => {
    return (await clientPromise).db(process.env.NEXT_ONLINE_STORE_DB_NAME!);
}



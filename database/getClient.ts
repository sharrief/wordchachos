import { MongoClient } from 'mongodb';

const url = process.env.HOST || '';
function getClient() { return new MongoClient(url); }
export default getClient;

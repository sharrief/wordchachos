import {
  CloudGame,
} from 'types';
import { manifestUser } from 'database/queryUser';
import getClient from './getClient';

export async function queryManyGames(name: string, code: string) {
  const client = getClient();
  const user = await manifestUser(name, code);
  await client.connect();
  const db = client.db(process.env.DBNAME as string);
  const gamesCollection = db.collection<CloudGame>(process.env.GAMESCOLLECTION as string);
  const games = await gamesCollection.find<CloudGame>({
    user_id: user.id,
  }).sort({ timestamp: -1 }).toArray();
  await client.close();
  if (!games?.length) return [] as CloudGame[];
  return games;
}

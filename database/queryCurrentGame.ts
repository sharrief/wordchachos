import {
  CloudGame, GameType,
} from 'types';
import { manifestUser } from 'database/queryUser';
import getClient from './getClient';

export async function queryCurrentGame(name: string, code: string, gameType: GameType) {
  const client = getClient();
  try {
    const user = await manifestUser(name, code);
    await client.connect();
    const db = client.db(process.env.DBNAME as string);
    const gamesCollection = db.collection<CloudGame>(process.env.GAMESCOLLECTION as string);
    const [game] = await gamesCollection.find<CloudGame>({
      user_id: user.id,
      type: gameType,
    }).sort({ timestamp: -1 }).limit(1).toArray();
    await client.close();
    if (!game) return { game: null };
    return { game };
  } catch ({ message }) {
    const error = message as string;
    return { error };
  }
}
